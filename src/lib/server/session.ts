"use server";

import * as crypto from "crypto";
import { cookies } from "next/headers";

const PASSWORD = process.env.PASSWORD || "secret";
const SESSION_COOKIE_NAME = "session";

export async function newSession(password?: string): Promise<boolean> {
  if (password === PASSWORD) {
    (await cookies()).set(SESSION_COOKIE_NAME, hash(), {
      expires: new Date(Date.now() + 86400000),
      path: "/",
    });
    return true;
  }
  return false;
}

export async function readSession(): Promise<boolean> {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  return session?.value === hash();
}

function hash(): string {
  const now = new Date();
  return crypto
    .createHash("sha256")
    .update(`${now.getFullYear()}-${now.getMonth() + 1}-${PASSWORD}`)
    .digest("hex");
}
