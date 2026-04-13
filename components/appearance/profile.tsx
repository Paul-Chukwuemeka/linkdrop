import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch, ApiError } from "@/lib/api";
import { UserProfileMe } from "@/lib/types";
import { useState } from "react";
import { Spinner } from "../ui/Spinner";

const Profile = () => {
  const { profile, setProfile, setError } = useContext(AppContext)!;
  const [isSaving, setIsSaving] = useState(false);

  const { refreshUser } = useAuth();

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
        },
      });
      setProfile(updated);
      await refreshUser();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
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
        Avatar URL
        <Input
          value={profile?.avatar_url || ""}
          onChange={(e) =>
            setProfile((p) => (p ? { ...p, avatar_url: e.target.value } : p))
          }
          placeholder="https://…"
        />
      </label>

      <div className="pt-2">
        <Button onClick={save} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? <Spinner /> : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
