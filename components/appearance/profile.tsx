import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useContext, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useAuthContext as useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import { UserProfileMe } from "@/lib/types";
import { useState } from "react";
import { Spinner } from "../ui/Spinner";
import Image from "next/image";
import { Upload } from "lucide-react";

const Profile = () => {
  const { profile, setProfile, setProfileError: setError } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { refreshUser } = useAuth();

  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return "/user.svg";
    // If it's already a full URL (R2 or external), return it
    if (url.startsWith("http")) return url;
    // Fallback for relative local paths
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const updated = await apiFetch<UserProfileMe>("/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });
      setProfile(updated);
      await refreshUser();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function save() {
    if (!profile) return;
    setError(null);
    setIsSaving(true);
    try {
      const updated = await apiFetch<UserProfileMe>("/profile/me", {
        method: "PATCH",
        json: {
          username: profile.username,
          fullname: profile.fullname,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        },
      });
      setProfile(updated);
      await refreshUser();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to save profile.");
    } finally {
      setIsSaving(false);
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
            <Image
              src={getAvatarUrl(profile?.avatar_url)}
              alt={profile?.fullname || "Avatar"}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
              <Spinner />
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <h3 className="font-bold text-lg text-neutral-800">Profile Image</h3>
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </Button>
            {profile?.avatar_url && (
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setProfile(p => p ? { ...p, avatar_url: null } : p)}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            JPG, PNG or GIF. Max size 2MB.
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 font-semibold text-neutral-800">
          Username
          <Input
            value={profile?.username}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, username: e.target.value } : p))
            }
            id="username"
          />
        </label>

        <label className="flex flex-col gap-2 font-semibold text-neutral-800">
          Full name
          <Input
            value={profile?.fullname}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, fullname: e.target.value } : p))
            }
            id="fullname"
          />
        </label>

        <label className="flex flex-col gap-2 font-semibold text-neutral-800">
          Bio
          <Textarea
            rows={4}
            value={profile?.bio || ""}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, bio: e.target.value } : p))
            }
            placeholder="Tell visitors what you do…"
          />
        </label>

        <label className="flex flex-col gap-2 font-semibold text-neutral-800">
          Avatar URL (Optional)
          <Input
            value={profile?.avatar_url || ""}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, avatar_url: e.target.value } : p))
            }
            placeholder="https://…"
          />
        </label>

        <div className="pt-2">
          <Button onClick={save} disabled={isSaving || isUploading} className="w-full sm:w-auto">
            {isSaving ? <Spinner /> : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
