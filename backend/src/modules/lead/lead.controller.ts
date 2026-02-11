import type { Request, Response } from "express";
import { createLeadSchema } from "./lead.schema.js";
import { sendLeadEmail } from "./lead.service.js";

export async function createLeadController(req: Request, res: Response) {
  const payload = createLeadSchema.parse(req.body);

  await sendLeadEmail(payload);

  return res.status(201).json({
    ok: true,
    data: {
      message: "Lead created and email sent",
    },
  });
}
