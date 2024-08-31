"use client";

import { useSignalR } from "@/providers/SignalRProvider";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useWebRtc } from "@/providers/WebRtcProvider";
import { useAuthorization } from "@/providers/AuthorizationProvider";
import { Mic, MicOff, PhoneMissed, Video, VideoOff } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

const CallPage = ({
  params: { receiverId },
}: {
  params: { receiverId: string };
}) => {
  const { connection } = useSignalR();
  const { user } = useAuthorization();
  const {
    myVideo,
    callInProgress,
    callEnded,
    userVideo,
    EndCall,
    Awaken,
    ReadyToCall,
    StartCall,
    AnswerCall,
  } = useWebRtc();
  const searchParams = useSearchParams();
  const isAnswer = searchParams.get("isAnswer") === "true";
  const [hasVideo, setHasVideo] = useState(
    searchParams.get("hasVideo") === "true"
  );
  const [userHasVideo, setUserHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [userHasAudio, setUserHasAudio] = useState(true);
  const [stream, setStream] = useState<MediaStream>();
  const [collaboratorInfo, setCollaboratorInfo] = useState<{
    name: string;
    avatar: string;
  }>();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: hasVideo, audio: hasAudio })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      }).catch(()=>{});
  }, [hasAudio, hasVideo, myVideo]);
  useEffect(() => {
    if (connection && stream) {
      const handleStartCall = (
        callerId: string,
        callerName: string,
        callerAvartar: string,
        hasVideo:boolean,
        signal: any
      ) => {
        setUserHasVideo(hasVideo);
        setCollaboratorInfo({ name: callerName, avatar: callerAvartar });
        AnswerCall(callerId, signal, stream);
      };
      connection.on("ReceiveStartCall", handleStartCall);

      const handleReceiveReadyCall = (
        receiverId: string,
        receiverName: string,
        receiverAvatar: string,
        hasVideo: boolean
      ) => {
        setUserHasVideo(hasVideo);
        setCollaboratorInfo({ name: receiverName, avatar: receiverAvatar });
        StartCall(receiverId, hasVideo,stream);
      };
      connection.on("ReceiveReadyCall", handleReceiveReadyCall);

      connection.on("ReceiveVideoChange",(state:boolean)=>setUserHasVideo(state))
      connection.on("ReceiveAudioChange",(state:boolean)=>setUserHasAudio(state))

      connection.on("ReceiveEndCall", () => window.close());
      return () => {
        connection.off("ReceiveStartCall", handleStartCall);
        connection.off("ReceiveReadyCall", handleReceiveReadyCall);
        connection.off("ReceiveVideoChange")
        connection.off("ReceiveAudioChange")
        connection.off("ReceiveEndCall")
      };
    }
  }, [connection, receiverId, stream]);

  useEffect(() => {
    if (connection) {
      if (isAnswer) {
        ReadyToCall(receiverId,hasVideo);
      } else {
        console.log("Awaken");
        Awaken(receiverId);
      }
    }
  }, [connection, isAnswer, receiverId]);

  useEffect(() => {
    const handle = () => {
      if (connection) {
        EndCall(receiverId);
      }
    };
    window.addEventListener("beforeunload", handle);
    return () => window.removeEventListener("beforeunload", handle);
  }, [connection, receiverId]);

  return (
    <main className="flex flex-col justify-between h-screen">
      {!callInProgress && (
        <audio src="/audios/waiting-voice.mp3" autoPlay playsInline loop />
      )}
      <section className="grid grid-cols-1 lg:grid-cols-2 size-full justify-center p-3 gap-3">
        {stream && (
          <div className="flex flex-col bg-card p-5 gap-3 rounded-2xl">
            <p className="text-center">{user.displayName}</p>
            {hasVideo ? (
              <video
                autoPlay
                playsInline
                muted
                ref={myVideo}
                className="aspect-video w-full rounded-2xl"
              />
            ) : (
              <>
                <audio hidden={!hasAudio} autoPlay playsInline muted ref={myVideo} />
                <div className="flex-center h-[50%]">
                  <UserAvatar size={180} avatarUrl={user.avatarUrl} />
                </div>
              </>
            )}
          </div>
        )}
        {callInProgress && !callEnded && (
          <div className="flex flex-col bg-card p-5 gap-3 rounded-2xl">
            <p className="text-center">{collaboratorInfo?.name}</p>
            {userHasVideo ? (
              <video
              autoPlay
              playsInline
              ref={userVideo}
              className="aspect-video w-full rounded-2xl"
            />
            ):(
              <>
                <audio hidden={!userHasAudio} autoPlay playsInline muted ref={userVideo} />
                <div className="flex-center h-[50%]">
                <UserAvatar size={180} avatarUrl={collaboratorInfo?.avatar} />
                </div>
              </>
            )}
          </div>
        )}
      </section>
      <div className="flex-center gap-3 bg-card py-3">
        {hasVideo ? (
          <button
            className="bg-blue-100 p-2 rounded-2xl"
            onClick={() => {
              setHasVideo(false)
              connection?.invoke("VideoChange",receiverId,false)
            }}
          >
            <Video className="text-primary fill-primary" />
          </button>
        ) : (
          <button
            className="bg-blue-100 p-2 rounded-2xl"
            onClick={() => {
              setHasVideo(true)
              connection?.invoke("VideoChange",receiverId,true)
            }}
          >
            <VideoOff className="text-primary fill-primary" />
          </button>
        )}
        {hasAudio ? (
          <button
          className="bg-blue-100 p-2 rounded-2xl"
          onClick={() => {
            setHasAudio(false)
            connection?.invoke("AudioChange",receiverId,false)
          }}
        >
          <Mic className="text-primary" />
        </button>
        ):(
          <button
          className="bg-blue-100 p-2 rounded-2xl"
          onClick={() => {
            setHasAudio(true)
            connection?.invoke("AudioChange",receiverId,true)
          }}
        >
          <MicOff className="text-primary" />
        </button>
        )}
        <button className="bg-red-100 p-2 rounded-2xl" onClick={() => EndCall(receiverId)}>
          <PhoneMissed
            className="text-red-500 fill-red-500"
          />
        </button>
      </div>
    </main>
  );
};

export default CallPage;
