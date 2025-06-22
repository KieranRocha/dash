// src/renderer/src/hooks/useLiveMachineData.ts - ATUALIZAÇÃO
import { useState, useEffect, useCallback, useRef } from "react";
import { machineApi, BOMVersion } from "../services/machineApi";
import type { Machine, ApiError } from "../types/machines";

export const useLiveMachineData = (projectId: number, machineId: number) => {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [bomVersions, setBomVersions] = useState<BOMVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshInterval = 30000; // 30 segundos

  const fetchMachineData = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      try {
        setError(null);

        // ✅ Debug logs
        console.log(
          `🔍 Carregando dados: projeto ${projectId}, máquina ${machineId}`,
        );

        const [machineData, bomData] = await Promise.all([
          machineApi.getMachine(projectId, machineId, signal),
          machineApi.getMachineBomVersions(projectId, machineId, signal),
        ]);

        if (!signal?.aborted) {
          console.log("✅ Dados recebidos:", {
            machine: machineData,
            bomVersions: bomData,
          });

          setMachine(machineData);
          setBomVersions(bomData || []); // ✅ Fallback para array vazio
          setLastUpdate(new Date());
        }
      } catch (err: any) {
        if (!signal?.aborted) {
          const apiError: ApiError = {
            message: err.message || "Erro ao buscar dados da máquina",
            code: "FETCH_ERROR",
          };
          setError(apiError);
          console.error("❌ Erro ao buscar dados:", err);
        }
      }
    },
    [projectId, machineId],
  );

  const refresh = useCallback(async (): Promise<void> => {
    console.log("🔄 Refresh manual iniciado");
    setLoading(true);

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

  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled((prev) => {
      const newValue = !prev;
      console.log(`🔄 Tempo real ${newValue ? "ativado" : "desativado"}`);
      return newValue;
    });
  }, []);

  // ✅ Carregamento inicial
  useEffect(() => {
    refresh();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refresh]);

  // ✅ Auto-refresh em tempo real
  useEffect(() => {
    if (!isRealTimeEnabled || !machine) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(async () => {
      try {
        console.log(`🔄 Auto-refresh: máquina ${machineId}`);
        const controller = new AbortController();
        await fetchMachineData(controller.signal);
      } catch (err) {
        console.warn("⚠️ Erro no auto-refresh:", err);
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
};
