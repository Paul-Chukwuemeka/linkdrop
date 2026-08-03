// Single source of truth for the authenticated profile JSON shape.
// Every endpoint (/me GET+PATCH, /upload-avatar, /current) must use this so
// the response contract matches UserProfileMe exactly — drift here silently
// broke last_selected_card and caused the dashboard to switch cards.

type ProfileRow = {
  id: string
  username: string
  email: string
  fullname: string
  bio: string | null
  avatarUrl: string | null
  theme: string
  currentCard: string | null
  lastSelectedCard: string | null
}

export function toProfileResponse(user: ProfileRow) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    bio: user.bio,
    avatar_url: user.avatarUrl,
    theme: user.theme,
    current_card: user.currentCard,
    last_selected_card: user.lastSelectedCard,
  }
}