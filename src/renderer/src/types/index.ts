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
  id: number;
  name: string;
  contractNumber?: string;
  description?: string;
  status:
    | "Planning"
    | "Active"
    | "OnHold"
    | "Review"
    | "Completed"
    | "Cancelled";
  client?: string;
  responsibleEngineer?: string;
  createdAt: string;
  lastActivity?: string;
  machineCount: number;
  progressPercentage: number;
  budgetValue?: number;
  actualCost?: number;
  estimatedHours: number;
  actualHours: number;
  // Campos calculados
  isOverdue?: boolean;
  isActive?: boolean;
  statusColor?: string;
}

export interface BOMVersion {
  id: number;
  versionNumber: number;
  extractedAt: string;
  extractedBy: string;
  items: BOMItem[];
}
