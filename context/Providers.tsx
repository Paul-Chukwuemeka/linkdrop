"use client";

import { ProfileProvider } from "./ProfileContext";
import { CardProvider } from "./CardContext";
import { StyleProvider } from "./StyleContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <CardProvider>
        <StyleProvider>
          {children}
        </StyleProvider>
      </CardProvider>
    </ProfileProvider>
  );
}
