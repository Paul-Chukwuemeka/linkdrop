import type { CSSProperties } from "react";

export type ThemeVars = {
  pageBg: string;
  linkBg: string;
  linkColor: string;
  accent: string;
  linkBorder: string;
};

export type ThemePresetKey = "default" | "dark" | "soft" | "lime";

export const THEME_PRESETS: Record<ThemePresetKey, { label: string; vars: ThemeVars }> =
  {
    default: {
      label: "Default",
      vars: {
        pageBg: "#FFFFFF",
        linkBg: "#1A1A1A",
        linkColor: "#FFFFFF",
        accent: "#C5F135",
        linkBorder: "none",
      },
    },
    dark: {
      label: "Dark",
      vars: {
        pageBg: "#0B0B0B",
        linkBg: "#FFFFFF",
        linkColor: "#1A1A1A",
        accent: "#C5F135",
        linkBorder: "none",
      },
    },
    soft: {
      label: "Soft",
      vars: {
        pageBg: "#F5F5F5",
        linkBg: "#FFFFFF",
        linkColor: "#1A1A1A",
        accent: "#1A1A1A",
        linkBorder: "1px solid #E0E0E0",
      },
    },
    lime: {
      label: "Lime",
      vars: {
        pageBg: "#C5F135",
        linkBg: "#1A1A1A",
        linkColor: "#FFFFFF",
        accent: "#1A1A1A",
        linkBorder: "none",
      },
    },
  };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseThemeJson(raw: string): ThemeVars | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;

    const bg = typeof parsed.bg_color === "string" ? parsed.bg_color : undefined;
    const linkBg = typeof parsed.link_bg === "string" ? parsed.link_bg : undefined;
    const linkText =
      typeof parsed.link_text === "string" ? parsed.link_text : undefined;
    const accent =
      typeof parsed.accent_color === "string" ? parsed.accent_color : undefined;
    const linkBorder =
      typeof parsed.link_border === "string" ? parsed.link_border : undefined;

    const vars = THEME_PRESETS.default.vars;
    return {
      pageBg: bg || vars.pageBg,
      linkBg: linkBg || vars.linkBg,
      linkColor: linkText || vars.linkColor,
      accent: accent || vars.accent,
      linkBorder: linkBorder || vars.linkBorder,
    };
  } catch {
    return null;
  }
}

export function resolveThemeVars(theme: string | null | undefined): ThemeVars {
  const raw = (theme || "default").trim();
  if (!raw) return THEME_PRESETS.default.vars;

  if (raw in THEME_PRESETS) {
    return THEME_PRESETS[raw as ThemePresetKey].vars;
  }

  if (raw.startsWith("{")) {
    const vars = parseThemeJson(raw);
    if (vars) return vars;
  }

  return THEME_PRESETS.default.vars;
}

export function themeVarsToStyle(vars: ThemeVars): CSSProperties {
  return {
    ["--page-bg" as never]: vars.pageBg,
    ["--link-bg" as never]: vars.linkBg,
    ["--link-color" as never]: vars.linkColor,
    ["--accent" as never]: vars.accent,
    ["--link-border" as never]: vars.linkBorder,
  };
}

