import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface AuthenticatedDiscordUser {
  id: string;
  username: string;
  avatarUrl: string;
}

export async function getAuthenticatedDiscordUser(
  request: Request
): Promise<AuthenticatedDiscordUser | null> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return null;

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  const user = data.user;
  if (error || !user) return null;

  const discordIdentity = user.identities?.find(
    (identity) => identity.provider === "discord"
  );
  if (!discordIdentity) return null;

  const metadata = user.user_metadata || {};
  const identityData = discordIdentity.identity_data || {};
  const discordId = [
    identityData.provider_id,
    identityData.sub,
    identityData.id,
    discordIdentity.identity_id,
  ].find((value): value is string =>
    typeof value === "string" && /^\d{17,20}$/.test(value)
  );
  if (!discordId) return null;

  const username =
    metadata.custom_claims?.global_name ||
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.username ||
    "Discord User";
  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    `https://cdn.discordapp.com/embed/avatars/${parseInt(
      String(discordId).slice(-1) || "0",
      10
    ) % 5}.png`;

  return {
    id: String(discordId),
    username: String(username),
    avatarUrl: String(avatarUrl),
  };
}
