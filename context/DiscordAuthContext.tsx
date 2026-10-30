"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string;
  avatar?: string;
  avatarUrl: string;
}

interface DiscordAuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  loginWithDiscord: () => Promise<void>;
  logout: () => Promise<void>;
}

const DiscordAuthContext = createContext<DiscordAuthContextType>({
  user: null,
  isLoading: true,
  loginWithDiscord: async () => {},
  logout: async () => {},
});

export function DiscordAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to normalize user metadata from Supabase or direct Discord API
  const parseDiscordUser = (supabaseUser: any): DiscordUser | null => {
    if (!supabaseUser) return null;

    const meta = supabaseUser.user_metadata || {};
    // Discord ID is stored in provider_id, sub, or provider_token
    const discordId =
      meta.provider_id ||
      meta.sub ||
      (supabaseUser.identities && supabaseUser.identities[0]?.identity_data?.provider_id) ||
      supabaseUser.id;

    const username =
      meta.custom_claims?.global_name ||
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      meta.username ||
      "Discord User";

    const avatarUrl =
      meta.avatar_url ||
      meta.picture ||
      `https://cdn.discordapp.com/embed/avatars/${parseInt(String(discordId).slice(-1) || "0", 10) % 5}.png`;

    return {
      id: String(discordId),
      username: String(username),
      avatarUrl: String(avatarUrl),
      avatar: meta.avatar,
    };
  };

  useEffect(() => {
    // 1. Check native Supabase Auth Session
    const checkSupabaseAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          const parsed = parseDiscordUser(session.user);
          if (parsed) {
            setUser(parsed);
            localStorage.setItem("esm_discord_user", JSON.stringify(parsed));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Supabase session check error:", err);
      }

      // 2. Fallback to localStorage session
      try {
        const stored = localStorage.getItem("esm_discord_user");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to restore cached user session", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupabaseAuth();

    // Listen to Supabase auth state changes (handles redirect return)
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const parsed = parseDiscordUser(session.user);
          if (parsed) {
            setUser(parsed);
            localStorage.setItem("esm_discord_user", JSON.stringify(parsed));
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("esm_discord_user");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Primary Login using Supabase Discord OAuth
  const loginWithDiscord = async () => {
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined;
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: redirectUrl,
          scopes: "identify email",
        },
      });

      if (error) {
        console.warn("Supabase OAuth sign-in fallback:", error.message);
        // Fallback to direct Discord OAuth if Supabase provider is still configuring
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1561348357614735451";
        const fallbackRedirect = encodeURIComponent(window.location.origin + "/");
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${fallbackRedirect}&response_type=token&scope=identify%20email`;
      }
    } catch (err) {
      console.error("Discord login error:", err);
    }
  };

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (e) {
      console.error("Signout error:", e);
    }
    setUser(null);
    localStorage.removeItem("esm_discord_user");
  };

  return (
    <DiscordAuthContext.Provider
      value={{ user, isLoading, loginWithDiscord, logout }}
    >
      {children}
    </DiscordAuthContext.Provider>
  );
}

export function useDiscordAuth() {
  return useContext(DiscordAuthContext);
}
