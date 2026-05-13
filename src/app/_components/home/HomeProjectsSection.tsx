import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import HomeProjectsTable from "./HomeProjectsTable";

const getProjects = async (userId: string) => {
  try {
    return await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });
  } catch {
    return [];
  }
};

const HomeProjectsSection = async () => {
  const session = await auth();
  const projects = session?.user ? await getProjects(session.user.id) : [];

  return <HomeProjectsTable projects={projects} />;
};

export default HomeProjectsSection;
