export interface BOMItem {
  partNumber: string;
  description: string;
  quantity: number;
  mass: number;
  material: string;
  level: number;
  documentPath?: string;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "inactive";
  lastActivity?: string;
  machineCount: number;
}

export interface BOMVersion {
  id: number;
  versionNumber: number;
  extractedAt: string;
  extractedBy: string;
  items: BOMItem[];
}
