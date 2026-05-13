"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ConstructionSidebarShellProps = {
  children: ReactNode;
};

const ConstructionSidebarShell = ({
  children,
}: ConstructionSidebarShellProps) => {
  const pathname = usePathname();
  const isProjectWorkspace = /^\/projects\/\d+(\/.*)?$/.test(pathname);

  if (!isProjectWorkspace) {
    return null;
  }

  return (
    <aside
      className="app-panel construction-sidebar--framed w-full shrink-0 rounded-lg p-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:w-80 lg:overflow-y-auto"
    >
      {children}
    </aside>
  );
};

export default ConstructionSidebarShell;
