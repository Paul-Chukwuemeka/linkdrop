"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfileMe } from "@/lib/types";
import { apiFetch, ApiError } from "@/lib/api";

type ProfileContextType = {
  profile: UserProfileMe | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileMe | null>>;
  isLoadingProfile: boolean;
  profileError: string | null;
  setProfileError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfileMe | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setProfileError(null);
      setIsLoadingProfile(true);
      try {
        const data = await apiFetch<UserProfileMe>("/api/profile/me");
        if (mounted) setProfile(data);
      } catch (err) {
        if (err instanceof ApiError) setProfileError(err.message);
        else setProfileError("Failed to load profile.");
      } finally {
        if (mounted) setIsLoadingProfile(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isLoadingProfile,
        profileError,
        setProfileError,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
