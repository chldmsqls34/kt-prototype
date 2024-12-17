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
            "flex items-center justify-center w-14 h-14 font-semibold mt-14 rounded-full text-xs text-white ml-14",
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

