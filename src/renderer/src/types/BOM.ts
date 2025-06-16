// src/types/BOM.ts
export interface BOMItem {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unit: string;
  material?: string;
  weight?: number;
  cost?: number;
  supplier?: string;
  leadTime?: number;
  level: number;
  parentId?: string;
  children?: BOMItem[];
  filePath?: string;
  isAssembly: boolean;
  thumbnail?: string;
}

export interface CADFileInfo {
  fileName: string;
  filePath: string;
  lastModified: Date;
  fileSize: number;
  cadType: "inventor" | "solidworks";
}

export interface BOMExtractionResult {
  success: boolean;
  bomData?: BOMItem[];
  error?: string;
  processingTime?: number;
}
