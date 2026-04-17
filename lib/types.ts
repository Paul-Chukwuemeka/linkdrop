import type { NextFont } from "next/dist/compiled/@next/font";

export type UUID = string;

export interface UserAuth {
  id: UUID;
  username: string;
  email: string;
  fullname: string;
}

export interface UserProfilePublic {
  id: UUID;
  username: string;
  fullname: string;
  bio: string | null;
  avatar_url: string | null;
  theme: string;
  cards: Card[];
}

export interface UserProfileMe extends UserProfilePublic {
  email: string;
  current_card: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserAuth;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface Card {
  id: UUID;
  user_id: UUID;
  name: string;
  links?: Link[];
  collections?: Collection[];
  items_list: ItemFromList[];
  style: CardTheme;
  // Fields from /profile/{username} endpoint
  fullname?: string;
  username?: string;
  bio?: string | null;
  avatar_url?: string | null;
  user?: publicCardUser;
}

export interface publicCardUser {
  avatar_url: string | null;
  bio: string | null;
  fullname: string | null;
  id: string | null;
  username: string | null;
}

export interface CardCreate {
  name?: string | null;
}

export interface CardUpdate {
  name?: string | null;
}

export interface Collection {
  id: UUID;
  card_id: UUID;
  title: string;
  position: number;
  links: Link[];
}

export interface CollectionCreate {
  card_id: UUID;
  title: string;
}

export interface CollectionUpdate {
  title?: string | null;
}

export type ItemFromList =
  | { content: Link; position: number; type: "link" }
  | { content: Collection; position: number; type: "collection" };

export interface Link {
  id: UUID;
  card_id: UUID;
  collection_id: UUID | null;
  title: string;
  url: string;
  position: number;
}

export interface LinkCreate {
  card_id?: UUID;
  collection_id?: UUID | null;
  title: string;
  url: string;
}

export interface LinkUpdate {
  title?: string | null;
  url?: string | null;
  collection_id?: UUID | null;
}

export interface LinkMove {
  collection_id?: UUID | null;
}

export type CardItem =
  | {
      type: "link";
      position: number;
      link: Link;
      collection?: null;
    }
  | {
      type: "collection";
      position: number;
      collection: Collection;
      link?: null;
    };

export interface CardItemReorderItem {
  type: "link" | "collection";
  id: UUID;
  position: number;
}

export interface CardItemReorderRequest {
  items: CardItemReorderItem[];
}

export interface LinkReorderItem {
  id: UUID;
  position: number;
}

export interface LinkReorderRequest {
  card_id: UUID;
  collection_id: UUID;
  items: LinkReorderItem[];
}

export interface CardTheme {
  bg_type: "solid" | "gradient" | "image";
  card_bg: string;
  gradient: string[];
  gradient_type: "linear" | "radial";
  gradient_direction: number; // Angle in degrees for linear gradients (0-360)
  button_bg: string;
  button_color: string;
  button_type: "solid" | "glass" | "outline";
  button_radius: "pill" | "round" | "square" | "rounder";
  text_size: "large" | "medium" | "small";
  text_color: string;
  title_color: string | null;
  title_size: "large" | "medium" | "small";
  font_style: string;
  shadow: "none" | "soft" | "medium" | "hard" | "glow" | null;
  profile_image: string | null;
  name?: string;
}

type NextFontWithVariable = NextFont & { variable: string };

export type FontType = {
  name: string;
  font: NextFontWithVariable;
};
