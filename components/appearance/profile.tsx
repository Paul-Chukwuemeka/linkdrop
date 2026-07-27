import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRef, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { apiFetch, ApiError } from "@/lib/api";
import { UserProfileMe } from "@/lib/types";
import { useState } from "react";
import { Spinner } from "../ui/Spinner";
import Image from "next/image";
import { Upload } from "lucide-react";
import { AvatarCropModal } from "@/components/ui/AvatarCropModal";

const Profile = () => {
  const { profile, setProfile, setProfileError: setError } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState(profile?.avatar_url || "");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setUrlInput(profile?.avatar_url || "");
  }, [profile?.avatar_url]);

  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return "/user.svg";
    if (url.startsWith("http")) return url;
    return "/user.svg";
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
  }

  function handleCropComplete(updated: UserProfileMe) {
    setProfile(updated);
    setCropFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCropCancel() {
    setCropFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function save() {
    if (!profile) return;
    setError(null);
    setIsSaving(true);
    try {
      const updated = await apiFetch<UserProfileMe>("/api/profile/me", {
        method: "PATCH",
        json: {
          username: profile.username,
          fullname: profile.fullname,
          bio: profile.bio,
          avatar_url: urlInput || null,
        },
      });
      setProfile(updated);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to save profile.");
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <div className="relative w-25 h-25 group">
          <div className="w-25 h-25 sm:w-full sm:h-full rounded-full overflow-hidden border-4 border-white dark:border-neutral-900 shadow-md bg-white dark:bg-neutral-700">
            {profile?.avatar_url && !imgError ? (
              <Image
                src={getAvatarUrl(profile?.avatar_url)}
                alt={profile?.fullname || "Avatar"}
                width={150}
                height={150}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black text-neutral-400">
                {profile?.fullname?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">Profile Image</h3>
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </Button>
            {profile?.avatar_url && (
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  setProfile(p => p ? { ...p, avatar_url: null } : p);
                  setUrlInput("");
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
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
        <label className="flex flex-col gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
          Username
          <Input
            value={profile?.username}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, username: e.target.value } : p))
            }
            id="username"
          />
        </label>

        <label className="flex flex-col gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
          Full name
          <Input
            value={profile?.fullname}
            onChange={(e) =>
              setProfile((p) => (p ? { ...p, fullname: e.target.value } : p))
            }
            id="fullname"
          />
        </label>

        <label className="flex flex-col gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
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

        <label className="flex flex-col gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
          Avatar URL (Optional)
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://…"
            disabled={!!profile?.avatar_url && profile.avatar_url.includes("/avatars/")}
            className={profile?.avatar_url && profile.avatar_url.includes("/avatars/") ? "opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800" : ""}
          />
          {profile?.avatar_url && profile.avatar_url.includes("/avatars/") ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Upload a photo or remove the current one to use a URL instead.</p>
          ) : !profile?.avatar_url ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Paste an image URL. It will be saved to your storage so it always loads.</p>
          ) : null}
        </label>

        <div className="pt-2">
          <Button onClick={save} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? <Spinner /> : "Save changes"}
          </Button>
        </div>
      </div>

      <AvatarCropModal
        file={cropFile}
        onComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

export default Profile;
