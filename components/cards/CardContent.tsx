import Link from "next/link"
import { PublicProfileHeader } from "@/components/profile/PublicProfileHeader"
import { PublicLinkCard } from "@/components/links/PublicLinkCard"
import { PublicCollection } from "@/components/collections/PublicCollection"
import { CardTheme, ItemFromList } from "@/lib/types"
import { buildCardBackground } from "@/lib/style-utils"

// Shared card body used by the public page (/u/...) and the editor preview.
// Both render the exact same DOM so the preview stays faithful to what
// visitors actually see.
export function CardContent({
  fullname,
  username,
  bio,
  avatarUrl,
  items,
  cardStyle,
  fontClassName,
  interactive = true,
}: {
  fullname: string
  username: string
  bio: string | null
  avatarUrl: string | null
  items: ItemFromList[]
  cardStyle: CardTheme
  fontClassName?: string
  interactive?: boolean
}) {
  const textColor = cardStyle.text_color || "ffffff"

  return (
    <div
      className={`rounded-3xl w-full shadow-(--shadow-card) backdrop-blur-sm p-6 sm:p-8 ${
        fontClassName || ""
      }`}
      style={buildCardBackground(cardStyle)}
    >
      <PublicProfileHeader
        fullname={fullname}
        username={username}
        bio={bio}
        avatarUrl={avatarUrl}
        title_size={cardStyle.title_size}
        text_size={cardStyle.text_size}
        text_color={textColor}
        title_color={cardStyle.title_color || textColor}
      />

      <div className="mt-4 flex flex-col gap-4">
        {items.map((item, i) =>
          item.type === "link" ? (
            <PublicLinkCard key={i} link={item.content} cardStyle={cardStyle} />
          ) : (
            <PublicCollection key={i} collection={item.content} cardStyle={cardStyle} />
          ),
        )}
      </div>

      <div className="mt-4 text-center">
        <div
          className="mx-auto mb-6 h-px w-16 opacity-20"
          style={{ backgroundColor: `#${textColor}` }}
        />
        {interactive ? (
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Join LinkForge
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
            Join LinkForge
          </span>
        )}
      </div>
    </div>
  )
}