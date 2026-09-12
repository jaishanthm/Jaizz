"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeCrudActions } from "./generic-crud";

// "current" comes from the form as "Yes"/"No" (GenericForm has no checkbox
// type — a select fits its existing capability without adding one just for
// this field) and is transformed to boolean here. Phase 4 §4's mutual-
// exclusivity rule (current=true means endDate must be empty) enforced here.
const ExperienceSchema = z.object({
  role: z.string().min(1),
  organization: z.string().min(1),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  current: z.enum(["Yes", "No"]).transform((v) => v === "Yes"),
  location: z.string().optional(),
  organizationUrl: z.string().url().optional().or(z.literal("")),
}).refine((data) => !(data.current && data.endDate), {
  message: "A current role can't have an end date — clear the end date or set Current to No.",
  path: ["endDate"],
});

const crud = makeCrudActions({
  model: prisma.experience, schema: ExperienceSchema, entityType: "Experience",
  permission: { create: "content.create", edit: "content.edit_all" },
  publicPath: "/experience", hasSortOrder: true,
});

export async function createExperience(input: z.infer<typeof ExperienceSchema>) {
  return crud.create(input);
}
export async function updateExperience(id: string, input: z.infer<typeof ExperienceSchema>) {
  return crud.update(id, input);
}
export async function deleteExperience(id: string) {
  return crud.remove(id);
}
export async function setExperienceVisible(id: string, visible: boolean) {
  return crud.setVisible(id, visible);
}
export async function moveExperience(id: string, direction: "up" | "down") {
  return crud.move(id, direction);
}
