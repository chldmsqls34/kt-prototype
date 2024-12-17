"use client";
import { useState } from "react";
import LiveTalk from "./live-talk";
import { ProfileDetail } from "@/types";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function LiveTalkToggle({ userData }: { userData: ProfileDetail | null }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="hidden lg:block">
      {!isOpen && (
        <button
          onClick={toggle}
          className={clsx(
            "fixed bottom-5 right-5 z-50 flex items-center justify-center w-16 h-16 font-semibold rounded-full text-xs text-white",
            "bg-[--red-color-100]"
          )}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}
      {isOpen && (
        <div className="pl-4">
          <LiveTalk userData={userData} onClose={toggle} />
        </div>
      )}
    </div>
  );
}

