import { Resend } from "resend";
import { env } from "@/config/env";

if (!env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set. Email functionality will not work.");
}

export const resend = new Resend(env.RESEND_API_KEY);
