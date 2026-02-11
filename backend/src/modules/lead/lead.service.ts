import { env } from "../../config/env.js";
import type { CreateLeadInput } from "./lead.schema.js";

type SendLeadEmailParams = CreateLeadInput;

export async function sendLeadEmail(params: SendLeadEmailParams) {
  const payload = {
    service_id: env.EMAILJS_SERVICE_ID,
    template_id: env.EMAILJS_TEMPLATE_ID,
    user_id: env.EMAILJS_PUBLIC_KEY,
    template_params: {
      email: params.email,
      name: params.name ?? "AI Enthusiast",
      download_link: env.DOWNLOAD_LINK,
      sender_name: env.SENDER_NAME,
      year: new Date().getFullYear(),
    },
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send email via EmailJS");
  }
}
