import { getAllProjectsForAdmin } from "@/lib/data/projects";
import ProjectsListClient from "./ProjectsListClient";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();
  return <ProjectsListClient projects={projects} />;
}
