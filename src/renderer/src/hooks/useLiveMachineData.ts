// src/renderer/src/hooks/useLiveMachineData.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { Machine } from "../types/machines";
import { machineApi } from "../services/machineApi";
import { ApiError } from "../types/index";

interface LiveMachineData {
  machine: Machine | null;
  bomVersions: any[];
  loading: boolean;
  error: ApiError | null;
  lastUpdate: Date | null;
  isRealTimeEnabled: boolean;
  refresh: () => Promise<void>;
  toggleRealTime: () => void;
}

export function useLiveMachineData(
  projectId: number,
  machineId: number,
  autoRefreshInterval: number = 30000, // 30 segundos padrão
): LiveMachineData {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [bomVersions, setBomVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Função para buscar dados da máquina
  const fetchMachineData = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      try {
        setError(null);

        // Busca dados da máquina e versões BOM em paralelo
        const [machineData, bomData] = await Promise.all([
          machineApi.getMachine(projectId, machineId, signal),
          machineApi.getMachineBomVersions(projectId, machineId, signal),
        ]);

        if (!signal?.aborted) {
          setMachine(machineData);
          setBomVersions(bomData);
          setLastUpdate(new Date());
        }
      } catch (err: any) {
        if (!signal?.aborted) {
          const apiError: ApiError = {
            message: err.message || "Erro ao buscar dados da máquina",
            code: "FETCH_ERROR",
          };
          setError(apiError);
          console.error("Erro ao buscar dados da máquina:", err);
        }
      }
    },
    [projectId, machineId],
  );

  // Função de refresh manual
  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);

    // Cancela requisição anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await fetchMachineData(controller.signal);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [fetchMachineData]);

  // Toggle do tempo real
  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled((prev) => !prev);
  }, []);

  // Effect para carregar dados iniciais
  useEffect(() => {
    refresh();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refresh]);

  // Effect para auto-refresh
  useEffect(() => {
    if (!isRealTimeEnabled || !machine) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Configura auto-refresh
    refreshIntervalRef.current = setInterval(async () => {
      try {
        console.log(`🔄 Auto-refresh máquina ${machineId}`);

        const controller = new AbortController();
        await fetchMachineData(controller.signal);
      } catch (err) {
        console.warn("Erro no auto-refresh:", err);
      }
    }, autoRefreshInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [
    isRealTimeEnabled,
    machine,
    autoRefreshInterval,
    fetchMachineData,
    machineId,
  ]);

  return {
    machine,
    bomVersions,
    loading,
    error,
    lastUpdate,
    isRealTimeEnabled,
    refresh,
    toggleRealTime,
  };
}
