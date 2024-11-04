"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, Settings, Github } from "lucide-react";
import { signOut } from "@/app/dashboard/actions";
import DropdownMenu from "./dropdown-menu";

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const loginProvider = user.app_metadata?.provider || "email";

  const trigger = (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative rounded-full overflow-hidden hover:ring-2 hover:ring-[#8B4513]/20 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#8B4513]/40"
    >
      {user.user_metadata?.avatar_url ? (
        <Image
          src={user.user_metadata.avatar_url}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 bg-[#8B4513]/10 rounded-full flex items-center justify-center">
          <span className="text-[#8B4513] text-sm font-medium">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </button>
  );

  return (
    <DropdownMenu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      trigger={trigger}
    >
      <div className="w-[320px] divide-y divide-neutral-100">
        {/* User Info Section */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {user.user_metadata?.avatar_url && (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full flex-shrink-0 object-cover"
              />
            )}
            <div className="flex-1">
              <div className="font-medium text-[#8B4513]">
                {user.user_metadata?.full_name || "User"}
              </div>
              <div className="text-sm text-[#8B4513]/60 break-words">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="p-1">
          <button
            onClick={() => {
              // Add manage account functionality later
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#8B4513] rounded-md transition-colors duration-200 hover:bg-[#8B4513]/5"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Manage Account
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-1">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#8B4513] rounded-md transition-colors duration-200 hover:bg-[#8B4513]/5"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Footer Section */}
        <div className="px-4 py-3 bg-neutral-50/50">
          <div className="flex items-center gap-2 text-xs text-[#8B4513]/60">
            {loginProvider === "github" && (
              <Github className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            <span>
              Signed in with{" "}
              {loginProvider.charAt(0).toUpperCase() + loginProvider.slice(1)}
            </span>
          </div>
          <div className="text-xs text-[#8B4513]/40 mt-1">
            Happy brewing! ☕️
          </div>
        </div>
      </div>
    </DropdownMenu>
  );
}
