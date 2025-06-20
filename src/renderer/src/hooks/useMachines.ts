// src/renderer/src/hooks/useMachines.ts
import { useState, useEffect, useCallback } from "react";
import {
  Machine,
  MachineSummary,
  CreateMachine,
  UpdateMachine,
} from "../types/machines";
import { machineApi } from "../services/machineApi";
import { ApiError } from "../types/index";

// Hook para listar máquinas de um projeto
export function useMachines(projectId: number) {
  const [machines, setMachines] = useState<MachineSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchMachines = useCallback(
    async (signal?: AbortSignal) => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await machineApi.getMachinesByProject(projectId, signal);
        setMachines(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError({
            message: err.message || "Erro ao carregar máquinas",
            code: "FETCH_ERROR",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchMachines(controller.signal);
    return () => controller.abort();
  }, [fetchMachines]);

  useEffect(() => {
    const controller = new AbortController();
    fetchMachines(controller.signal);
    return () => controller.abort();
  }, [fetchMachines]);

  return {
    machines,
    loading,
    error,
    refetch,
  };
}

// Hook para máquina específica
export function useMachine(projectId: number, machineId: number | undefined) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchMachine = useCallback(
    async (pId: number, mId: number, signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);
        const data = await machineApi.getMachine(pId, mId, signal);
        setMachine(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError({
            message: err.message || "Erro ao carregar máquina",
            code: "FETCH_ERROR",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!projectId || !machineId || isNaN(Number(machineId))) {
      setLoading(false);
      setError({
        message: "ID de projeto ou máquina inválido",
        code: "INVALID_ID",
      });
      return;
    }

    const controller = new AbortController();
    fetchMachine(projectId, Number(machineId), controller.signal);
    return () => controller.abort();
  }, [projectId, machineId, fetchMachine]);

  const refetch = useCallback(() => {
    if (projectId && machineId && !isNaN(Number(machineId))) {
      const controller = new AbortController();
      fetchMachine(projectId, Number(machineId), controller.signal);
      return () => controller.abort();
    }
  }, [projectId, machineId, fetchMachine]);

  return {
    machine,
    loading,
    error,
    refetch,
  };
}

// Hook para operações CRUD de máquinas
export function useMachineOperations(projectId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createMachine = useCallback(
    async (machineData: CreateMachine) => {
      try {
        setLoading(true);
        setError(null);
        const result = await machineApi.createMachine(projectId, machineData);
        return result;
      } catch (err: any) {
        const apiError: ApiError = {
          message: err.message || "Erro ao criar máquina",
          code: "CREATE_ERROR",
        };
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  const updateMachine = useCallback(
    async (machineId: number, machineData: UpdateMachine) => {
      try {
        setLoading(true);
        setError(null);
        const result = await machineApi.updateMachine(
          projectId,
          machineId,
          machineData,
        );
        return result;
      } catch (err: any) {
        const apiError: ApiError = {
          message: err.message || "Erro ao atualizar máquina",
          code: "UPDATE_ERROR",
        };
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  const deleteMachine = useCallback(
    async (machineId: number) => {
      try {
        setLoading(true);
        setError(null);
        await machineApi.deleteMachine(projectId, machineId);
      } catch (err: any) {
        const apiError: ApiError = {
          message: err.message || "Erro ao excluir máquina",
          code: "DELETE_ERROR",
        };
        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [projectId],
  );

  return {
    createMachine,
    updateMachine,
    deleteMachine,
    loading,
    error,
  };
}
