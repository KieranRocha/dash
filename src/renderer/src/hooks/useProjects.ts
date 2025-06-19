import { useState, useEffect } from "react";
import { api } from "../services/api"; // Usando a sua classe de API
import { Project } from "../types/index"; // O tipo completo de Projeto

export function useProjects(projectId: number | string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Evita a chamada caso o ID não seja válido
    if (!projectId || isNaN(Number(projectId))) {
      setLoading(false);
      setError(new Error("ID de projeto inválido."));
      return;
    }

    setLoading(true);
    api
      .getProject(Number(projectId))
      .then((data: Project) => {
        setProject(data);
      })
      .catch((err: Error) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]); // A requisição é refeita se o projectId mudar

  return { project, loading, error };
}
