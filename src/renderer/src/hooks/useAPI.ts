import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error };
}

export function useBOM(projectId: string, machineId: string) {
  const [bom, setBom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectId && machineId) {
      api
        .getBOM(projectId, machineId)
        .then(setBom)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [projectId, machineId]);

  const refresh = () => {
    setLoading(true);
    api
      .getBOM(projectId, machineId)
      .then(setBom)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { bom, loading, error, refresh };
}
