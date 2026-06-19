import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "complex_password_at_least_32_characters_long_123456",
  cookieName: "gunze_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

export interface SessionData {
  isLoggedIn: boolean;
  username?: string;
}

declare module "iron-session" {
  interface IronSessionData {
    admin: SessionData;
  }
}
