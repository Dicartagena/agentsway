"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LanguageDropdown, LANGUAGES } from "@/components/language-dropdown";

interface CallButtonProps {
  status: "disconnected" | "connecting" | "connected" | "disconnecting";
  startCall: () => void;
  hasMediaAccess: boolean;
  requestMediaPermissions: () => void;
  isVideoEnabled: boolean;
  toggleVideoEnabled: (value: boolean) => void;
  language: string | null;
  setLanguage: (value: string) => void;
  languages: typeof LANGUAGES;
}

const RINGING_PHONE_AUDIO_DURATION = 6000;

export function CallButton({
  status,
  startCall,
  hasMediaAccess,
  requestMediaPermissions,
  isVideoEnabled,
  toggleVideoEnabled,
  language,
  setLanguage,
  languages,
}: CallButtonProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [ringingPhoneAudio] = useState(() => {
    if (typeof Audio !== "undefined") {
      const audioInstance = new Audio("/assets/ringing-phone.mp3");
      audioInstance.loop = true;
      return audioInstance;
    }
    return null;
  });

  const onCallClick = () => {
    if (!hasMediaAccess) {
      requestMediaPermissions();
      return;
    }
    setIsCalling(true);
    ringingPhoneAudio?.play();
    setTimeout(() => {
      ringingPhoneAudio?.pause();
      ringingPhoneAudio?.load();
      startCall();
    }, RINGING_PHONE_AUDIO_DURATION);
  };
  return (
    <>
      {!isCalling && (
        <div className={"text-white flex items-center gap-2 text-sm mb-2"}>
          For the best experience, find a quiet place
        </div>
      )}
      <Button
        variant="default"
        onClick={onCallClick}
        disabled={isCalling || status !== "disconnected"}
        className={cn(
          "relative w-64 h-16 rounded-full border-red-500 border-2 hover:bg-red-900/90 bg-white/5 backdrop-blur-[16px] shadow-2xl",
          isCalling && "bg-red-900/90"
        )}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Image
            src="/assets/santa.webp"
            alt="Santa"
            className="rounded-full"
            width={48}
            height={48}
          />
          <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        {!isCalling && (
          <>
            <span className="text-lg ml-10 font-semibold">Call Santa</span>
          </>
        )}
        {isCalling && (
          <>
            <span className="text-lg ml-10 font-semibold">Ringing...</span>
            <span className="ml-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </span>
          </>
        )}
      </Button>
      {!isCalling && (
        <div className={"flex items-center gap-2 text-sm mt-2"}>
          <LanguageDropdown
            language={language}
            setLanguage={setLanguage}
            languages={languages}
          />
        </div>
      )}
      <div className="flex items-center space-x-2 pt-3">
        <Switch
          id="airplane-mode"
          className="bg-red-500"
          checked={isVideoEnabled}
          onCheckedChange={toggleVideoEnabled}
        />
        <Label htmlFor="airplane-mode" className="text-white">
          Enable Video
        </Label>
      </div>
    </>
  );
}
