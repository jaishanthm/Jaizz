import { prisma } from "@/lib/prisma";
import ThemeClient from "./ThemeClient";

export default async function AdminThemePage() {
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } });
  return <ThemeClient initial={{ accentColor: settings.accentColor, glassIntensity: settings.glassIntensity, animationIntensity: settings.animationIntensity, threeDMode: settings.threeDMode }} />;
}
