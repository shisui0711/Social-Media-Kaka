import UserAvatar from "@/components/UserAvatar";
import { Mic, PhoneMissed, Video } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-col justify-between h-screen">
      {/* <audio src="/audios/waiting-voice.mp3" autoPlay playsInline loop /> */}
      <section className="grid grid-cols-1 xl:grid-cols-2 size-full justify-center items-center p-3 gap-3">
        <div className="flex flex-col bg-card p-5 gap-3 rounded-2xl">
          <p className="text-center text-xl">Nguyễn Văn A</p>
          <audio/>
          <div className="flex-center h-[50%]">
          <UserAvatar size={180}/>
          </div>
        </div>
        <div className="flex flex-col bg-card p-5 gap-3 rounded-2xl">
          <p className="text-center text-xl">Nguyễn Văn B</p>
          <audio/>
          <div className="flex-center h-[50%]">
          <UserAvatar size={180}/>
          </div>
        </div>
      </section>
      <div className="flex-center gap-3 bg-card py-3">
        <button className="bg-blue-100 p-2 rounded-2xl">
          <Video className="text-primary fill-primary" />
        </button>
        <button className="bg-blue-100 p-2 rounded-2xl">
          <Mic className="text-primary" />
        </button>
        <button className="bg-red-100 p-2 rounded-2xl">
          <PhoneMissed className="text-red-500 fill-red-500" />
        </button>
      </div>
    </main>
  );
};

export default page;
