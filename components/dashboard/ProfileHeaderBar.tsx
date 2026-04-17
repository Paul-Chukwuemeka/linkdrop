import Image from "next/image";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { TbLogout } from "react-icons/tb";
import { UserProfileMe } from "@/lib/types";

export const ProfileHeaderBar = ({
  profile,
  logout
}: {
  profile: UserProfileMe | null;
  logout: () => void;
}) => {
  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 flex gap-3 items-center shadow-(--shadow-card) ring-1 ring-(--color-border) rounded-xl">
      <div
        className={`${!profile?.avatar_url && "p-2"} w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-gray-600/50 lg:w-14 lg:h-14 overflow-hidden flex items-center justify-center bg-gray-200 shrink-0`}
      >
        <Image
          src={profile?.avatar_url ? profile?.avatar_url : "/user.svg"}
          alt={profile?.fullname || "User"}
          className="w-full h-full object-cover"
          width={80}
          height={80}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <Link
          href={"/dashboard/appearance#username"}
          className="flex items-center gap-1 font-semibold"
        >
          <span className="truncate text-lg md:text-xl h-fit">
            {profile?.fullname}
          </span>
          <PenLine className="w-4 shrink-0" />
        </Link>
        <Link
          href={"/dashboard/appearance#fullname"}
          className="text-xs sm:text-sm md:text-md border-b border-dashed w-fit"
        >
          @{profile?.username}
        </Link>
      </div>

      <button
        className="w-9 h-9 sm:w-10 sm:h-10 md:hidden justify-center text-gray-700 flex items-center shadow-md bg-white rounded-full shrink-0 touch-manipulation"
        onClick={logout}
        aria-label="Log out"
      >
        <TbLogout className="w-4 sm:w-5" />
      </button>
    </div>
  );
};
