"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeCrudActions } from "./generic-crud";

const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
});

const crud = makeCrudActions({
  model: prisma.education, schema: EducationSchema, entityType: "Education",
  permission: { create: "content.create", edit: "content.edit_all" },
  publicPath: "/about", hasSortOrder: true,
});

export async function createEducation(input: z.infer<typeof EducationSchema>) {
  return crud.create(input);
}
export async function updateEducation(id: string, input: z.infer<typeof EducationSchema>) {
  return crud.update(id, input);
}
export async function deleteEducation(id: string) {
  return crud.remove(id);
}
export async function setEducationVisible(id: string, visible: boolean) {
  return crud.setVisible(id, visible);
}
export async function moveEducation(id: string, direction: "up" | "down") {
  return crud.move(id, direction);
}
