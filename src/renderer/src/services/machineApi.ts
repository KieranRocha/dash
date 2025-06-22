// src/renderer/src/services/machineApi.ts - VERSÃO CORRIGIDA
import {
  Machine,
  MachineSummary,
  CreateMachine,
  UpdateMachine,
} from "../types/machines";

// ✅ DEFINIR TIPOS BOM
export interface BOMVersion {
  id: number;
  versionNumber: number;
  extractedAt: string;
  extractedBy: string;
  itemCount: number;
  createdAt: string;
}

export interface BOMItem {
  partNumber: string;
  description: string;
  quantity: number;
  stockNumber?: string;
}

export interface MachineLiveStatus {
  id: number;
  name: string;
  status: string;
  isActive: boolean;
  lastBomExtraction?: string;
  totalBomVersions: number;
  currentFile?: string;
  lastActivity?: string;
  updatedAt: string;
  quickStats: MachineQuickStats;
}

export interface MachineQuickStats {
  bomVersionsThisWeek: number;
  lastSaveTime?: string;
  activeUsersCount: number;
}

export class MachineAPIService {
  private baseUrl = "http://localhost:5047";

  async getMachinesByProject(
    projectId: number,
    signal?: AbortSignal,
  ): Promise<MachineSummary[]> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines`,
      {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar máquinas: ${response.statusText}`);
    }

    return response.json();
  }

  async getMachine(
    projectId: number,
    machineId: number,
    signal?: AbortSignal,
  ): Promise<Machine> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}`,
      {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar máquina: ${response.statusText}`);
    }

    return response.json();
  }

  async createMachine(
    projectId: number,
    machineData: CreateMachine,
    signal?: AbortSignal,
  ): Promise<Machine> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines`,
      {
        method: "POST",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(machineData),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao criar máquina: ${response.statusText}`);
    }

    return response.json();
  }

  async updateMachine(
    projectId: number,
    machineId: number,
    machineData: UpdateMachine,
    signal?: AbortSignal,
  ): Promise<Machine> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}`,
      {
        method: "PUT",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(machineData),
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao atualizar máquina: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteMachine(
    projectId: number,
    machineId: number,
    signal?: AbortSignal,
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}`,
      {
        method: "DELETE",
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao excluir máquina: ${response.statusText}`);
    }
  }

  // ✅ CORRIGIDO: Tipo específico
  async getMachineLiveStatus(
    projectId: number,
    machineId: number,
    signal?: AbortSignal,
  ): Promise<MachineLiveStatus> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}/live-status`,
      {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao buscar status da máquina: ${response.statusText}`,
      );
    }

    return response.json();
  }

  // ✅ CORRIGIDO: Tipo específico + tratamento erro
  async getMachineBomVersions(
    projectId: number,
    machineId: number,
    signal?: AbortSignal,
  ): Promise<BOMVersion[]> {
    try {
      console.log(
        `🔍 Buscando versões BOM: projeto ${projectId}, máquina ${machineId}`,
      );

      const response = await fetch(
        `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}/bom-versions`,
        {
          signal,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar versões BOM: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Versões BOM recebidas:`, data);

      return data;
    } catch (error) {
      console.error("❌ Erro ao buscar versões BOM:", error);
      throw error;
    }
  }

  // ✅ NOVO: Buscar BOM específica
  async getBOMDetails(
    projectId: number,
    machineId: number,
    versionId: number,
    signal?: AbortSignal,
  ): Promise<BOMItem[]> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/machines/${machineId}/bom-versions/${versionId}/items`,
      {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar detalhes da BOM: ${response.statusText}`);
    }

    return response.json();
  }
}

export const machineApi = new MachineAPIService();
