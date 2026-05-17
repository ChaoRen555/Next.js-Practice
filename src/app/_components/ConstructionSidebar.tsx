import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ConstructionSidebarShell from "./ConstructionSidebarShell";

type ConstructionSidebarProject = {
  id: number;
  name: string;
};

const getProjects = async (userId: string) => {
  try {
    return await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  } catch {
    return [] satisfies ConstructionSidebarProject[];
  }
};

const sidebarLinkClass =
  "block truncate rounded-md px-2.5 py-2 text-sm font-medium text-[var(--text)] transition duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]";

const ConstructionSidebar = async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const projects = await getProjects(session.user.id);

  return (
    <ConstructionSidebarShell>
      <nav aria-label="Project list" className="space-y-1">
        {projects.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-2.5">
            <p className="text-sm font-medium text-[var(--text)]">
              No projects
            </p>
          </div>
        ) : null}

        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className={sidebarLinkClass}
            title={project.name}
          >
            {project.name}
          </Link>
        ))}
      </nav>
    </ConstructionSidebarShell>
  );
};

export default ConstructionSidebar;
