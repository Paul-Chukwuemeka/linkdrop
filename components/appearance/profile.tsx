import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRef, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import { UserProfileMe } from "@/lib/types";
import { useState } from "react";
import { ButtonLoader } from "../ui/ButtonLoader";
import Image from "next/image";
import { Upload } from "lucide-react";
import { AvatarCropModal } from "@/components/ui/AvatarCropModal";
import { BIO_MAX_LENGTH } from "@/lib/validations/cards";

const Profile = () => {
  const { profile, setProfile, setProfileError: setError } = useProfile();
  const { currentCard, setCurrentCard, updateCardMeta } = useCard();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(profile?.avatar_url || "");
  const [imgError, setImgError] = useState(false);
  const [savedUsername, setSavedUsername] = useState<string | null>(null);
  const [useProfileBio, setUseProfileBio] = useState<boolean>(
    currentCard?.use_profile_bio ?? true,
  );
  const [cardBio, setCardBio] = useState<string>(currentCard?.bio ?? "");

  useEffect(() => {
    setUseProfileBio(currentCard?.use_profile_bio ?? true);
    setCardBio(currentCard?.bio ?? "");
  }, [currentCard?.id, currentCard?.bio, currentCard?.use_profile_bio]);

  useEffect(() => {
    if (!currentCard) return;
    if (useProfileBio !== currentCard.use_profile_bio) {
      setCurrentCard((prev) => prev ? { ...prev, use_profile_bio: useProfileBio } : prev);
    }
  }, [useProfileBio, currentCard?.use_profile_bio, setCurrentCard]);

  useEffect(() => {
    setUrlInput(profile?.avatar_url || "");
  }, [profile?.avatar_url]);

  useEffect(() => {
    if (profile && savedUsername === null) setSavedUsername(profile.username);
  }, [profile, savedUsername]);

  useEffect(() => {
    if (!avatarBlob) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarBlob);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarBlob]);

  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return "/user.svg";
    // Absolute (re-hosted or remote) or a relative /avatars/ path rendered as-is;
    // anything else is a legacy/garbage value we shouldn't hand to <Image>.
    if (url.startsWith("http") || url.startsWith("/avatars/")) return url;
    return "/user.svg";
  };

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
  }

  function handleCropComplete(blob: Blob) {
    setAvatarBlob(blob);
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
      let avatarUrl: string | null = urlInput || null;

      if (avatarBlob) {
        const formData = new FormData();
        formData.append("file", avatarBlob, "avatar.png");
        const uploaded = await apiFetch<UserProfileMe>(
          "/api/profile/upload-avatar",
          { method: "POST", body: formData },
        );
        avatarUrl = uploaded.avatar_url;
        setUrlInput(uploaded.avatar_url || "");
        setAvatarBlob(null);
      }

      // Only send username when it actually changed. Always sending it breaks
      // legacy OAuth users with short (< 3 char) usernames, because the schema
      // rejects them and the profile could never be saved again.
      const payload: Record<string, unknown> = {
        fullname: profile.fullname,
        bio: profile.bio,
        avatar_url: avatarUrl,
      };
      if (savedUsername !== null && profile.username !== savedUsername) {
        payload.username = profile.username;
      }

      const updated = await apiFetch<UserProfileMe>("/api/profile/me", {
        method: "PATCH",
        json: payload,
      });
      setSavedUsername(updated.username);
      setProfile(updated);

      if (currentCard) {
        const nextBio = useProfileBio ? null : cardBio;
        const bioChanged = nextBio !== currentCard.bio;
        const toggleChanged = useProfileBio !== currentCard.use_profile_bio;
        if (bioChanged || toggleChanged) {
          await updateCardMeta({ bio: nextBio, use_profile_bio: useProfileBio });
        }
      }
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
            {avatarPreview ? (
              <div
                className="h-full w-full rounded-full bg-cover bg-center ring-2 ring-(--accent)"
                style={{ backgroundImage: `url(${avatarPreview})` }}
              />
            ) : profile?.avatar_url && !imgError ? (
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
            {(profile?.avatar_url || avatarPreview) && (
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (avatarPreview) {
                    setAvatarBlob(null);
                    return;
                  }
                  setProfile(p => p ? { ...p, avatar_url: null } : p);
                  setUrlInput("");
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            JPG, PNG, GIF or WebP. Max size 5MB.
          </p>
          {avatarPreview && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
              New photo selected — uploads when you click Save changes.
            </p>
          )}
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

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-neutral-900 p-3 ring-1 ring-black/5">
            <div>
              <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Use profile bio
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {useProfileBio
                  ? "This card uses your global profile bio."
                  : "This card uses its own custom bio."}
              </div>
            </div>
            <button
              onClick={() => setUseProfileBio((v) => !v)}
              disabled={isSaving}
              className={`relative h-6 w-12 shrink-0 rounded-full transition-colors ${
                useProfileBio
                  ? "bg-black dark:bg-white"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
              aria-checked={useProfileBio}
              role="switch"
            >
              <span
                className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white dark:bg-black transition-transform ${
                  useProfileBio ? "translate-x-6.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <label className="flex flex-col gap-2 font-semibold text-neutral-800 dark:text-neutral-200">
            {useProfileBio ? "Profile bio" : "Card bio"}
            <Textarea
              rows={4}
              maxLength={BIO_MAX_LENGTH}
              value={useProfileBio ? profile?.bio || "" : cardBio}
              onChange={(e) => {
                if (useProfileBio) {
                  setProfile((p) => (p ? { ...p, bio: e.target.value } : p));
                } else {
                  setCardBio(e.target.value);
                }
              }}
              placeholder={
                useProfileBio
                  ? "Tell visitors what you do…"
                  : "This bio only shows on this card."
              }
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
              {(useProfileBio ? profile?.bio ?? "" : cardBio).length}/
              {BIO_MAX_LENGTH}
            </span>
          </label>
        </div>

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
            {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Save changes"}
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
