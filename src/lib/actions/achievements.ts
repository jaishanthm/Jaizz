"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { makeCrudActions } from "./generic-crud";

const AchievementSchema = z.object({
  title: z.string().min(1),
  category: z.enum(["RANKING", "COMPETITION", "AWARD", "ACKNOWLEDGEMENT", "PUBLICATION", "MILESTONE", "OTHER"]),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

const crud = makeCrudActions({
  model: prisma.achievement, schema: AchievementSchema, entityType: "Achievement",
  permission: { create: "content.create", edit: "content.edit_all" },
  publicPath: "/achievements", hasSortOrder: true,
});

export async function createAchievement(input: z.infer<typeof AchievementSchema>) {
  return crud.create(input);
}
export async function updateAchievement(id: string, input: z.infer<typeof AchievementSchema>) {
  return crud.update(id, input);
}
export async function deleteAchievement(id: string) {
  return crud.remove(id);
}
export async function setAchievementVisible(id: string, visible: boolean) {
  return crud.setVisible(id, visible);
}
export async function setAchievementFeatured(id: string, featured: boolean) {
  return crud.setFeatured(id, featured);
}
export async function moveAchievement(id: string, direction: "up" | "down") {
  return crud.move(id, direction);
}
