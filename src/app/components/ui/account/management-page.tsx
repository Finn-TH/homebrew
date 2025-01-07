"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, User, Key, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Tab = "personal" | "security";

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.username || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
    }
    loadProfile();
  }, []);

  const handleResetPassword = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No email found");

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      });

      if (error) throw error;
      setMessage("Password reset email sent!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateUsername = async () => {
    try {
      setIsUpdating(true);
      setError(null);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Only update when the user clicks the Update button
      const { error } = await supabase.auth.updateUser({
        data: {
          username: username,
          full_name: username,
        },
      });

      if (error) throw error;

      setMessage("Username updated successfully!");
      // Only refresh after successful update
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUpdating(true);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Create a unique file name using user id and timestamp
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;

      // Upload image to Profile Pictures bucket
      const { error: uploadError, data } = await supabase.storage
        .from("Profile Pictures") // Updated bucket name
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true, // This will replace if file exists
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("Profile Pictures") // Updated bucket name
        .getPublicUrl(fileName);

      // Update user metadata with new avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage("Profile picture updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? "bg-[#8B4513] text-white"
          : "text-[#8B4513] hover:bg-[#8B4513]/10"
      }`}
    >
      {label}
    </button>
  );

  const PersonalInfoTab = () => (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="p-4 border border-[#8B4513]/10 rounded-lg">
        <h2 className="flex items-center gap-2 text-lg font-medium text-[#8B4513] mb-4">
          <User className="w-5 h-5" />
          Profile Picture
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full object-cover w-16 h-16"
                priority
              />
            ) : (
              <div className="w-16 h-16 bg-[#8B4513]/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#8B4513]" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-1 bg-[#8B4513] rounded-full cursor-pointer hover:bg-[#8B4513]/90 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUpdating}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Username Section */}
      <div className="p-4 border border-[#8B4513]/10 rounded-lg">
        <h2 className="flex items-center gap-2 text-lg font-medium text-[#8B4513] mb-4">
          <User className="w-5 h-5" />
          Username
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="flex-1 px-4 py-2 border border-[#8B4513]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50"
          />
          <button
            onClick={handleUpdateUsername}
            disabled={isUpdating || !username}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="p-4 border border-[#8B4513]/10 rounded-lg">
        <h2 className="flex items-center gap-2 text-lg font-medium text-[#8B4513] mb-4">
          <Key className="w-5 h-5" />
          Password & Security
        </h2>
        <button
          onClick={handleResetPassword}
          className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors"
        >
          Reset Password
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF6EC] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <Coffee className="w-8 h-8 text-[#8B4513]" />
            <h1 className="text-2xl font-bold text-[#8B4513]">
              Account Settings
            </h1>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[#8B4513]/10 pb-4">
            <TabButton tab="personal" label="Personal Info" />
            <TabButton tab="security" label="Security" />
          </div>

          {/* Tab Content */}
          {activeTab === "personal" ? <PersonalInfoTab /> : <SecurityTab />}
        </motion.div>
      </div>
    </div>
  );
}
