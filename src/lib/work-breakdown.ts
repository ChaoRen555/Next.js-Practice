import type { Prisma, WorkStatus } from "@prisma/client";
import * as XLSX from "xlsx";

export type WorkBreakdownImportRow = {
  unitProjectName: string;
  divisionWorkName: string;
  subItemWorkName: string;
  code: string | null;
  category: string | null;
  trade: string | null;
  quantity: number | null;
  unit: string | null;
  status: WorkStatus;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  progress: number;
};

export type WorkBreakdownImportIssue = {
  row: number;
  message: string;
};

export type WorkBreakdownImportResult = {
  created: {
    unitProjects: number;
    divisionWorks: number;
    subItemWorks: number;
  };
  updated: {
    subItemWorks: number;
  };
  rowsProcessed: number;
};

export type ProjectWorkBreakdownSummary = {
  totalUnitProjects: number;
  totalDivisionWorks: number;
  totalSubItemWorks: number;
  averageProgress: number;
  overdueSubItemWorks: number;
  statusCounts: Record<WorkStatus, number>;
  tradeCounts: Array<{
    label: string;
    count: number;
  }>;
  categoryCounts: Array<{
    label: string;
    count: number;
  }>;
};

type RawImportRow = Record<string, unknown>;

type ParseImportResult =
  | {
      rows: WorkBreakdownImportRow[];
      issues: [];
    }
  | {
      rows: [];
      issues: WorkBreakdownImportIssue[];
    };

const workStatuses = [
  "PLANNED",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly WorkStatus[];

const statusAliases: Record<string, WorkStatus> = {
  active: "IN_PROGRESS",
  cancelled: "CANCELLED",
  canceled: "CANCELLED",
  completed: "COMPLETED",
  "in progress": "IN_PROGRESS",
  in_progress: "IN_PROGRESS",
  paused: "PAUSED",
  planned: "PLANNED",
  已取消: "CANCELLED",
  已完成: "COMPLETED",
  暂停: "PAUSED",
  进行中: "IN_PROGRESS",
  计划: "PLANNED",
  规划: "PLANNED",
};

const columnAliases = {
  unitProjectName: [
    "unitProjectName",
    "unit project",
    "unit project name",
    "单位工程",
    "单位工程名称",
  ],
  divisionWorkName: [
    "divisionWorkName",
    "division work",
    "division work name",
    "分部工程",
    "分部工程名称",
  ],
  subItemWorkName: [
    "subItemWorkName",
    "sub item work",
    "sub item work name",
    "分项工程",
    "分项工程名称",
    "清单名称",
  ],
  code: ["code", "编号", "编码", "项目编码", "清单编码"],
  category: ["category", "类别", "分类"],
  trade: ["trade", "专业", "工种"],
  quantity: ["quantity", "工程量", "数量"],
  unit: ["unit", "单位", "计量单位"],
  status: ["status", "状态"],
  plannedStartDate: [
    "plannedStartDate",
    "planned start date",
    "计划开始",
    "计划开始日期",
  ],
  plannedEndDate: [
    "plannedEndDate",
    "planned end date",
    "计划完成",
    "计划完成日期",
    "计划结束",
    "计划结束日期",
  ],
  progress: ["progress", "进度", "完成率"],
} as const;

const normalizeHeader = (value: string) => {
  return value.trim().toLowerCase().replaceAll(/[\s_-]+/g, "");
};

const headerLookup = new Map<string, keyof typeof columnAliases>();

Object.entries(columnAliases).forEach(([fieldName, aliases]) => {
  aliases.forEach((alias) => {
    headerLookup.set(
      normalizeHeader(alias),
      fieldName as keyof typeof columnAliases,
    );
  });
});

const normalizeNameKey = (value: string | null) => {
  return (value ?? "").trim().toLowerCase();
};

const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"' && inQuotes && nextCharacter === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += character;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0));
};

const csvRowsToObjects = (rows: string[][]): RawImportRow[] => {
  const [headers, ...dataRows] = rows;

  if (!headers) {
    return [];
  }

  return dataRows.map((row) => {
    return headers.reduce<RawImportRow>((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {});
  });
};

const readCell = (
  row: RawImportRow,
  fieldName: keyof typeof columnAliases,
) => {
  const matchedEntry = Object.entries(row).find(([header]) => {
    return headerLookup.get(normalizeHeader(header)) === fieldName;
  });

  if (!matchedEntry) {
    return null;
  }

  const value = matchedEntry[1];

  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim() || null;
};

const parseDateCell = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

const parseQuantity = (value: string | null) => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.replaceAll(",", "");
  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
};

const parseProgress = (value: string | null) => {
  if (!value) {
    return 0;
  }

  const normalizedValue = value.replace("%", "").trim();
  const parsedValue = Number.parseInt(normalizedValue, 10);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, parsedValue));
};

const parseStatus = (value: string | null): WorkStatus => {
  if (!value) {
    return "PLANNED";
  }

  const normalizedValue = value.trim().toLowerCase();
  const aliasedStatus = statusAliases[normalizedValue];

  if (aliasedStatus) {
    return aliasedStatus;
  }

  const directStatus = workStatuses.find((status) => {
    return status.toLowerCase() === normalizedValue;
  });

  return directStatus ?? "PLANNED";
};

const normalizeRawRows = (rawRows: RawImportRow[]): ParseImportResult => {
  const issues: WorkBreakdownImportIssue[] = [];
  const rows = rawRows.flatMap((rawRow, index) => {
    const rowNumber = index + 2;
    const unitProjectName = readCell(rawRow, "unitProjectName");
    const divisionWorkName = readCell(rawRow, "divisionWorkName");
    const subItemWorkName = readCell(rawRow, "subItemWorkName");

    if (!unitProjectName || !divisionWorkName || !subItemWorkName) {
      issues.push({
        row: rowNumber,
        message: "Unit project, division work, and sub-item work are required.",
      });
      return [];
    }

    return {
      unitProjectName,
      divisionWorkName,
      subItemWorkName,
      code: readCell(rawRow, "code"),
      category: readCell(rawRow, "category"),
      trade: readCell(rawRow, "trade"),
      quantity: parseQuantity(readCell(rawRow, "quantity")),
      unit: readCell(rawRow, "unit"),
      status: parseStatus(readCell(rawRow, "status")),
      plannedStartDate: parseDateCell(readCell(rawRow, "plannedStartDate")),
      plannedEndDate: parseDateCell(readCell(rawRow, "plannedEndDate")),
      progress: parseProgress(readCell(rawRow, "progress")),
    };
  });

  if (issues.length > 0) {
    return {
      rows: [],
      issues,
    };
  }

  return {
    rows,
    issues: [],
  };
};

export const parseWorkBreakdownImportFile = async (
  file: File,
): Promise<ParseImportResult> => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "csv") {
    const text = await file.text();
    return normalizeRawRows(csvRowsToObjects(parseCsv(text)));
  }

  if (extension === "xlsx" || extension === "xls") {
    const workbook = XLSX.read(Buffer.from(await file.arrayBuffer()), {
      cellDates: false,
      type: "buffer",
    });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return {
        rows: [],
        issues: [
          {
            row: 1,
            message: "Workbook does not contain a sheet.",
          },
        ],
      };
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<RawImportRow>(sheet, {
      defval: "",
    });

    return normalizeRawRows(rawRows);
  }

  return {
    rows: [],
    issues: [
      {
        row: 1,
        message: "Upload a CSV, XLS, or XLSX file.",
      },
    ],
  };
};

type WorkBreakdownProject = Prisma.ProjectGetPayload<{
  include: {
    unitProjects: {
      include: {
        divisionWorks: {
          include: {
            subItemWorks: true;
          };
        };
      };
    };
  };
}>;

export const buildProjectWorkBreakdownSummary = (
  project: WorkBreakdownProject,
): ProjectWorkBreakdownSummary => {
  const statusCounts = workStatuses.reduce<Record<WorkStatus, number>>(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<WorkStatus, number>,
  );
  const tradeCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();
  let totalProgress = 0;
  let totalTrackedItems = 0;
  let overdueSubItemWorks = 0;
  const now = new Date();

  project.unitProjects.forEach((unitProject) => {
    statusCounts[unitProject.status] += 1;
    totalProgress += unitProject.progress;
    totalTrackedItems += 1;

    unitProject.divisionWorks.forEach((divisionWork) => {
      statusCounts[divisionWork.status] += 1;
      totalProgress += divisionWork.progress;
      totalTrackedItems += 1;

      if (divisionWork.category) {
        categoryCounts.set(
          divisionWork.category,
          (categoryCounts.get(divisionWork.category) ?? 0) + 1,
        );
      }

      divisionWork.subItemWorks.forEach((subItemWork) => {
        statusCounts[subItemWork.status] += 1;
        totalProgress += subItemWork.progress;
        totalTrackedItems += 1;

        if (
          subItemWork.plannedEndDate &&
          subItemWork.plannedEndDate < now &&
          subItemWork.status !== "COMPLETED" &&
          subItemWork.status !== "CANCELLED"
        ) {
          overdueSubItemWorks += 1;
        }

        if (subItemWork.trade) {
          tradeCounts.set(
            subItemWork.trade,
            (tradeCounts.get(subItemWork.trade) ?? 0) + 1,
          );
        }
      });
    });
  });

  const toSortedCounts = (counts: Map<string, number>) => {
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 6);
  };

  return {
    totalUnitProjects: project.unitProjects.length,
    totalDivisionWorks: project.unitProjects.reduce((total, unitProject) => {
      return total + unitProject.divisionWorks.length;
    }, 0),
    totalSubItemWorks: project.unitProjects.reduce((total, unitProject) => {
      return total + unitProject.divisionWorks.reduce((divisionTotal, divisionWork) => {
        return divisionTotal + divisionWork.subItemWorks.length;
      }, 0);
    }, 0),
    averageProgress:
      totalTrackedItems > 0 ? Math.round(totalProgress / totalTrackedItems) : 0,
    overdueSubItemWorks,
    statusCounts,
    tradeCounts: toSortedCounts(tradeCounts),
    categoryCounts: toSortedCounts(categoryCounts),
  };
};

export const importWorkBreakdownRows = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  rows: WorkBreakdownImportRow[],
): Promise<WorkBreakdownImportResult> => {
  const result: WorkBreakdownImportResult = {
    created: {
      unitProjects: 0,
      divisionWorks: 0,
      subItemWorks: 0,
    },
    updated: {
      subItemWorks: 0,
    },
    rowsProcessed: rows.length,
  };
  const existingProject = await tx.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      unitProjects: {
        include: {
          divisionWorks: {
            include: {
              subItemWorks: true,
            },
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
  });

  if (!existingProject) {
    throw new Error("Project not found");
  }

  const unitProjectsByName = new Map<
    string,
    {
      id: number;
      divisionWorksByName: Map<
        string,
        {
          id: number;
          subItemWorksByNameAndCode: Map<string, number>;
        }
      >;
    }
  >();

  existingProject.unitProjects.forEach((unitProject) => {
    const divisionWorksByName = new Map<
      string,
      {
        id: number;
        subItemWorksByNameAndCode: Map<string, number>;
      }
    >();

    unitProject.divisionWorks.forEach((divisionWork) => {
      const subItemWorksByNameAndCode = new Map<string, number>();

      divisionWork.subItemWorks.forEach((subItemWork) => {
        subItemWorksByNameAndCode.set(
          `${normalizeNameKey(subItemWork.name)}::${normalizeNameKey(subItemWork.code)}`,
          subItemWork.id,
        );
      });

      divisionWorksByName.set(normalizeNameKey(divisionWork.name), {
        id: divisionWork.id,
        subItemWorksByNameAndCode,
      });
    });

    unitProjectsByName.set(normalizeNameKey(unitProject.name), {
      id: unitProject.id,
      divisionWorksByName,
    });
  });

  for (const [index, row] of rows.entries()) {
    const unitProjectKey = normalizeNameKey(row.unitProjectName);
    let unitProject = unitProjectsByName.get(unitProjectKey);

    if (!unitProject) {
      const createdUnitProject = await tx.unitProject.create({
        data: {
          projectId,
          name: row.unitProjectName,
          status: row.status,
          plannedStartDate: row.plannedStartDate,
          plannedEndDate: row.plannedEndDate,
          progress: row.progress,
          sortOrder: unitProjectsByName.size,
        },
      });

      unitProject = {
        id: createdUnitProject.id,
        divisionWorksByName: new Map(),
      };
      unitProjectsByName.set(unitProjectKey, unitProject);
      result.created.unitProjects += 1;
    }

    const divisionWorkKey = normalizeNameKey(row.divisionWorkName);
    let divisionWork = unitProject.divisionWorksByName.get(divisionWorkKey);

    if (!divisionWork) {
      const createdDivisionWork = await tx.divisionWork.create({
        data: {
          unitProjectId: unitProject.id,
          name: row.divisionWorkName,
          code: row.code,
          category: row.category,
          status: row.status,
          plannedStartDate: row.plannedStartDate,
          plannedEndDate: row.plannedEndDate,
          progress: row.progress,
          sortOrder: unitProject.divisionWorksByName.size,
        },
      });

      divisionWork = {
        id: createdDivisionWork.id,
        subItemWorksByNameAndCode: new Map(),
      };
      unitProject.divisionWorksByName.set(divisionWorkKey, divisionWork);
      result.created.divisionWorks += 1;
    }

    const subItemWorkKey = `${normalizeNameKey(row.subItemWorkName)}::${normalizeNameKey(row.code)}`;
    const existingSubItemWorkId =
      divisionWork.subItemWorksByNameAndCode.get(subItemWorkKey);

    if (existingSubItemWorkId) {
      await tx.subItemWork.update({
        where: {
          id: existingSubItemWorkId,
        },
        data: {
          description: null,
          trade: row.trade,
          quantity: row.quantity,
          unit: row.unit,
          status: row.status,
          plannedStartDate: row.plannedStartDate,
          plannedEndDate: row.plannedEndDate,
          progress: row.progress,
        },
      });
      result.updated.subItemWorks += 1;
      continue;
    }

    const createdSubItemWork = await tx.subItemWork.create({
      data: {
        divisionWorkId: divisionWork.id,
        name: row.subItemWorkName,
        code: row.code,
        trade: row.trade,
        quantity: row.quantity,
        unit: row.unit,
        status: row.status,
        plannedStartDate: row.plannedStartDate,
        plannedEndDate: row.plannedEndDate,
        progress: row.progress,
        sortOrder: divisionWork.subItemWorksByNameAndCode.size + index,
      },
    });

    divisionWork.subItemWorksByNameAndCode.set(
      subItemWorkKey,
      createdSubItemWork.id,
    );
    result.created.subItemWorks += 1;
  }

  return result;
};
