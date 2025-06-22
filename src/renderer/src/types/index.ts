import { MachineSummary } from "./machines";

// src/types/index.ts - CORRIGIDO: Alinhado com DTOs do backend
export interface Project {
  id: number;
  name: string;
  contractNumber?: string;
  description?: string;
  folderPath?: string;
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
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  budgetValue?: number;
  actualCost?: number;
  progressPercentage: number;
  estimatedHours: number;
  actualHours: number;
  machineCount: number;
  lastActivity?: string;
  totalBomVersions: number;
  machines?: MachineSummary[];

  // Campos calculados que vêm do backend
  budgetVariance?: number;
  hourVariance?: number;
}

export interface ProjectSummary {
  id: number;
  name: string;
  contractNumber?: string;
  status: string;
  client?: string;
  progressPercentage: number;
  machineCount: number;
  lastActivity?: string;
  createdAt: string;
  endDate?: string;

  // Campos calculados do backend
  isOverdue: boolean;
  isActive: boolean;
  statusColor: string;
}

export interface CreateProject {
  name: string;
  contractNumber?: string;
  description?: string;
  folderPath?: string;
  client?: string;
  responsibleEngineer?: string;
  startDate?: string;
  endDate?: string;
  budgetValue?: number;
  estimatedHours?: number;
  initialMachines?: string[];
}

export interface UpdateProject {
  name?: string;
  contractNumber?: string;
  description?: string;
  folderPath?: string;
  status?: string;
  client?: string;
  responsibleEngineer?: string;
  startDate?: string;
  endDate?: string;
  budgetValue?: number;
  actualCost?: number;
  progressPercentage?: number;
  estimatedHours?: number;
  actualHours?: number;
}

export interface BOMItem {
  partNumber: string;
  description?: string;
  quantity: number;
  stockNumber?: string;
  // Campos opcionais para compatibilidade com BOMs existentes
  level?: number;
  mass?: number;
  material?: string;
  unit?: string;
  category?: string;
}
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
}
