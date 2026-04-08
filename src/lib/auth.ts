import { cookies } from "next/headers";

export const AUTH_COOKIE = "bb_user";

export const getAuthUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(AUTH_COOKIE)?.value;
  return value && value.length > 0 ? value : null;
};

export const clearAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
};
