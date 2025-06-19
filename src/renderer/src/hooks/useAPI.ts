// src/hooks/useAPI.ts - CORRIGIDO: Hooks funcionais
import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { Project, ProjectSummary, ApiError } from "../types/index";

// Hook para listagem de projetos
export function useProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProjects = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjects(signal);
      setProjects(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError({
          message: err.message || "Erro ao carregar projetos",
          status: err.status,
          code: err.code,
          details: err.details,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch,
  };
}

// Hook para projeto específico
export function useProject(projectId: number | string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProject = useCallback(async (id: number, signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProject(id, signal);
      setProject(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError({
          message: err.message || "Erro ao carregar projeto",
          status: err.status,
          code: err.code,
          details: err.details,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Valida se projectId é válido
    if (!projectId || isNaN(Number(projectId))) {
      setLoading(false);
      setError({
        message: "ID de projeto inválido",
        code: "INVALID_ID",
      });
      return;
    }

    const controller = new AbortController();
    fetchProject(Number(projectId), controller.signal);
    return () => controller.abort();
  }, [projectId, fetchProject]);

  const refetch = useCallback(() => {
    if (projectId && !isNaN(Number(projectId))) {
      const controller = new AbortController();
      fetchProject(Number(projectId), controller.signal);
      return () => controller.abort();
    }
  }, [projectId, fetchProject]);

  return {
    project,
    loading,
    error,
    refetch,
  };
}

// Hook para operações de projeto (criar, editar, deletar)
export function useProjectOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createProject = useCallback(async (projectData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.createProject(projectData);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || "Erro ao criar projeto",
        status: err.status,
        code: err.code,
        details: err.details,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: number, projectData: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.updateProject(id, projectData);
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || "Erro ao atualizar projeto",
        status: err.status,
        code: err.code,
        details: err.details,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.deleteProject(id);
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || "Erro ao excluir projeto",
        status: err.status,
        code: err.code,
        details: err.details,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProject,
    updateProject,
    deleteProject,
    loading,
    error,
  };
}

// Hook para testar conexão com a API
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const testConnection = useCallback(async () => {
    try {
      setLoading(true);
      const connected = await api.testConnection();
      setIsConnected(connected);
    } catch {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    testConnection();

    // Testa conexão a cada 30 segundos
    const interval = setInterval(testConnection, 30000);
    return () => clearInterval(interval);
  }, [testConnection]);

  return { isConnected, loading, testConnection };
}
