"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeCrudActions } from "./generic-crud";

const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  credentialId: z.string().optional(),
  issueDate: z.coerce.date(),
  expirationDate: z.coerce.date().optional(),
  verificationUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

const crud = makeCrudActions({
  model: prisma.certification,
  schema: CertificationSchema,
  entityType: "Certification",
  permission: { create: "content.create", edit: "content.edit_all" },
  publicPath: "/certifications",
  hasSortOrder: true,
});

export async function createCertification(input: z.infer<typeof CertificationSchema>) {
  return crud.create(input);
}
export async function updateCertification(id: string, input: z.infer<typeof CertificationSchema>) {
  return crud.update(id, input);
}
export async function deleteCertification(id: string) {
  return crud.remove(id);
}
export async function setCertificationVisible(id: string, visible: boolean) {
  return crud.setVisible(id, visible);
}
export async function setCertificationFeatured(id: string, featured: boolean) {
  return crud.setFeatured(id, featured);
}
export async function moveCertification(id: string, direction: "up" | "down") {
  return crud.move(id, direction);
}
