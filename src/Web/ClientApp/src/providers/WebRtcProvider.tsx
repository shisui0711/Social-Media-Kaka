"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { useSignalR } from "./SignalRProvider";
import { useAuthorization } from "./AuthorizationProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, Video } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

interface WebRtcContextType {
  Awaken: (receiverId: string) => void;
  ReadyToCall: (callerId: string,hasVideo:boolean) => void;
  StartCall: (receiverId: string,hasVideo:boolean,stream:MediaStream) => void;
  AnswerCall: (callerId:string,signal:any,stream:MediaStream) => void;
  EndCall: (collaboratorId:string) => void;
  myVideo: React.MutableRefObject<HTMLVideoElement | null>;
  userVideo: React.MutableRefObject<HTMLVideoElement | null>;
  callInProgress: boolean;
  callEnded: boolean;
}

const WebRtcContext = createContext<WebRtcContextType | undefined>(undefined);

export const WebRtcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { connection } = useSignalR();
  const { user: me } = useAuthorization();
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const [callerInfo, setCallerInfo] = useState<{id:string,name:string,avatar:string} | null>(null);

  useEffect(() => {
    if (connection) {
      const handle = (callerId:string,callerName: string,callerAvatar:string) => {
        setCallerInfo({id:callerId,name:callerName,avatar:callerAvatar});
        setOpenCallDialog(true)
      };
      connection.on("ReceiveAwaken", handle);
      return () => {
        connection.off("ReceiveAwaken", handle);
      }
    }
  }, [connection]);

  const Awaken = (receiverId: string) => {
    try {
      connection!.invoke("AwakenUser", receiverId,me.displayName,me.avatarUrl);
    } catch (error) {
      console.log('error:', error)
    }
  };

  const ReadyToCall = (callerId: string,hasVideo:boolean) => {
    try {
      connection!.invoke("ReadyToCall", callerId,me.displayName,me.avatarUrl,hasVideo);
    } catch (error) {
      console.log(error)
    }
  };

  const StartCall = (receiverId: string,hasVideo:boolean,stream:MediaStream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data: any) => {
      connection!.invoke("StartCall", receiverId, me.displayName,me.avatarUrl, hasVideo, data);
    });

    peer.on("stream", (currentStream: MediaStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    peer.on("error", (err) => {
      console.error("Error in peer connection:", err);
    });

    connection!.on("ReceiveAnswerCall", (signal: any) => {
      setCallInProgress(true);
      peer.signal(signal);
    });
    peerRef.current = peer;
  };

  const AnswerCall = (callerId:string,signal: any,stream:MediaStream) => {
    setCallInProgress(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data: any) => {
      connection!.invoke("AnswerCall",callerId, data);
    });

    peer.on("stream", (currentStream: MediaStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    peer.on("error", (err) => {
      console.error("Error in peer connection:", err);
    });

    peer.signal(signal);
    peerRef.current = peer;
  };

  const EndCall = (collaboratorId:string) => {
    console.log("Entry encall")
    connection?.invoke("EndCall",collaboratorId)
    setCallEnded(true);
    peerRef.current?.destroy();
    window.close();
  };

  return (
    <WebRtcContext.Provider
      value={{
        Awaken,
        ReadyToCall,
        StartCall,
        AnswerCall,
        EndCall,
        myVideo,
        userVideo,
        callInProgress,
        callEnded,
      }}
    >
      <Dialog open={openCallDialog} onOpenChange={setOpenCallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-3" >
              <audio src="/audios/waiting-voice.mp3" autoPlay playsInline loop />
              <div className="flex-center"><UserAvatar size={100} avatarUrl={callerInfo?.avatar}/></div>
              <p className="text-center"><strong>{callerInfo?.name}</strong> đang gọi cho bạn</p>
            </DialogTitle>
            <DialogDescription className="flex justify-center gap-3 pt-6">
            <Button variant="ghost" onClick={()=>{
                setOpenCallDialog(false)
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const left = screenWidth / 2 - 1200 / 2;
                const top = screenHeight / 2 - 600 / 2;
                window.open(
                  `/groupcall/${callerInfo?.id}?isAnswer=true&hasVideo=true`,
                  "_blank",
                  `noopener,noreferrer,width=${1200},height=${600},left=${left},top=${top}`
                );
              }}>
                <Video className="text-primary fill-primary" />
              </Button>
              <Button variant="ghost" onClick={()=>{
                setOpenCallDialog(false)
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const left = screenWidth / 2 - 1200 / 2;
                const top = screenHeight / 2 - 600 / 2;
                window.open(
                  `/groupcall/${callerInfo?.id}?isAnswer=true`,
                  "_blank",
                  `noopener,noreferrer,width=${1200},height=${600},left=${left},top=${top}`
                );
              }}>
                <PhoneCall className="text-primary fill-primary" />
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {children}
    </WebRtcContext.Provider>
  );
};

export const useWebRtc = () => {
  const context = useContext(WebRtcContext);
  if (!context) {
    throw new Error("useWebRtc must be used within a WebRtcProvider");
  }
  return context;
};
