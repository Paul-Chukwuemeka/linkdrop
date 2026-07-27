import React, { useState } from "react";

export function ProfileHeader({
  fullname,
  username,
  bio,
  avatarUrl,
}: {
  fullname: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <header className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="h-20 w-20 overflow-hidden rounded-full bg-white/40 ring-1 ring-black/10">
        {avatarUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={fullname}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-black text-neutral-900">
            {fullname?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div
          className="text-2xl font-black tracking-tight text-neutral-900"
 
        >
          {fullname}
        </div>
        <div className="text-sm font-semibold text-neutral-700">@{username}</div>
        {bio ? (
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-800/80">
            {bio}
          </p>
        ) : null}
      </div>
    </header>
  );
}

