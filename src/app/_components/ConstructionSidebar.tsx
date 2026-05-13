import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ConstructionSidebarShell from "./ConstructionSidebarShell";

type ConstructionSidebarProject = {
  id: number;
  name: string;
  unitProjects: Array<{
    id: number;
    name: string;
    divisionWorks: Array<{
      id: number;
      name: string;
      subItemWorks: Array<{
        id: number;
        name: string;
      }>;
    }>;
  }>;
};

const getProjectHierarchy = async (userId: string) => {
  try {
    return await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        unitProjects: {
          select: {
            id: true,
            name: true,
            divisionWorks: {
              select: {
                id: true,
                name: true,
                subItemWorks: {
                  select: {
                    id: true,
                    name: true,
                  },
                  orderBy: [
                    {
                      sortOrder: "asc",
                    },
                    {
                      createdAt: "asc",
                    },
                  ],
                },
              },
              orderBy: [
                {
                  sortOrder: "asc",
                },
                {
                  createdAt: "asc",
                },
              ],
            },
          },
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },
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
  "block rounded-md px-2.5 py-1.5 text-sm text-[var(--text)] transition duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]";

const mutedLinkClass =
  "block rounded-md px-2.5 py-1.5 text-sm text-[var(--muted)] transition duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]";

const ConstructionSidebar = async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const projects = await getProjectHierarchy(session.user.id);

  return (
    <ConstructionSidebarShell>
      <div className="construction-sidebar-header mb-3 flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            Projects
          </p>
          <h2 className="text-base font-semibold text-[var(--text)]">
            工程层级
          </h2>
        </div>
        <Link
          href="/projects/new"
          className="rounded-md border border-[var(--line-strong)] bg-[var(--surface-strong)] px-2.5 py-1.5 text-sm font-medium text-[var(--text)] transition duration-200 hover:border-[var(--accent)] hover:bg-[var(--surface-hover)]"
        >
          New
        </Link>
      </div>

      <nav aria-label="Construction project hierarchy" className="space-y-1">
        <Link href="/dashboard" className={sidebarLinkClass}>
          Dashboard
        </Link>
        <Link href="/projects" className={sidebarLinkClass}>
          All Projects
        </Link>
        <Link href="/issues" className={sidebarLinkClass}>
          Tasks
        </Link>

        <div className="construction-sidebar-divider my-3 border-t border-[var(--line)]" />

        {projects.length === 0 ? (
          <div className="construction-sidebar-empty rounded-lg border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-3">
            <p className="text-sm font-medium text-[var(--text)]">
              No projects yet
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Create a project to build its unit, division, and sub-item work
              structure.
            </p>
          </div>
        ) : null}

        {projects.map((project) => (
          <div key={project.id} className="space-y-1">
            <Link
              href={`/projects/${project.id}`}
              className="block rounded-md bg-[var(--surface-soft)] px-2.5 py-2 text-sm font-semibold text-[var(--text)] transition duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--accent-strong)]"
            >
              {project.name}
            </Link>

            {project.unitProjects.map((unitProject) => (
              <div key={unitProject.id} className="ml-3 border-l border-[var(--line)] pl-2">
                <Link
                  href={`/projects/${project.id}/unit-projects/${unitProject.id}`}
                  className={sidebarLinkClass}
                >
                  {unitProject.name}
                </Link>

                {unitProject.divisionWorks.map((divisionWork) => (
                  <div key={divisionWork.id} className="ml-3 border-l border-[var(--line)] pl-2">
                    <Link
                      href={`/projects/${project.id}/unit-projects/${unitProject.id}/division-works/${divisionWork.id}`}
                      className={mutedLinkClass}
                    >
                      {divisionWork.name}
                    </Link>

                    {divisionWork.subItemWorks.map((subItemWork) => (
                      <div key={subItemWork.id} className="ml-3 border-l border-[var(--line)] pl-2">
                        <Link
                          href={`/projects/${project.id}/unit-projects/${unitProject.id}/division-works/${divisionWork.id}/sub-item-works/${subItemWork.id}`}
                          className={mutedLinkClass}
                        >
                          {subItemWork.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </ConstructionSidebarShell>
  );
};

export default ConstructionSidebar;
