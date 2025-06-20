// src/renderer/src/types/machines.ts
export interface Machine {
  id: number;
  name: string;
  operationNumber?: string;
  description?: string;
  folderPath?: string;
  mainAssemblyPath?: string;
  status:
    | "Planning"
    | "Design"
    | "Review"
    | "Manufacturing"
    | "Testing"
    | "Completed";
  projectId: number;
  createdAt: string;
  updatedAt: string;
  lastBomExtraction?: string;
  totalBomVersions: number;
}

export interface MachineSummary {
  id: number;
  name: string;
  operationNumber?: string;
  status: string;
  totalBomVersions: number;
  lastBomExtraction?: string;
  statusColor: string;
}

export interface CreateMachine {
  name: string;
  operationNumber?: string;
  description?: string;
  folderPath?: string;
  mainAssemblyPath?: string;
}

export interface UpdateMachine {
  name?: string;
  operationNumber?: string;
  description?: string;
  folderPath?: string;
  mainAssemblyPath?: string;
  status?: string;
}
