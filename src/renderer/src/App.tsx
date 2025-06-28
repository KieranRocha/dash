// src/renderer/src/App.tsx - CORRIGIDO
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ProjectsPage } from './pages/ProjectPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { MachineDetailPage } from './pages/MachineDetailPage'; // ✅ ADICIONADO
import { PartsPage } from './pages/PartsPage';

/**
 * Componente genérico para páginas que estão na sidebar mas ainda não foram criadas.
 */
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="mt-2 text-gray-600">Página em construção.</p>
  </div>
);

/**
 * Componente principal da aplicação que gerencia o roteamento.
 * Utiliza o MainLayout para encapsular as páginas com a sidebar e o header.
 */
export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Rota principal para a Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Rotas relacionadas a Projetos */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<CreateProjectPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />

        {/* ✅ ADICIONADO: Rota para máquinas específicas */}
        <Route path="projects/:projectId/machines/:machineId" element={<MachineDetailPage />} />
        {/* ✅ NOVA: Catálogo de Peças */}
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/parts/:partNumber" element={<PartsPage />} /> {/* Para abrir modal direto */}

        {/* Rotas para itens da sidebar que ainda serão implementados */}
        <Route path="bom" element={<PlaceholderPage title="Lista de Materiais (BOMs)" />} />
        <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="engineers" element={<PlaceholderPage title="Engenheiros" />} />
        <Route path="quality" element={<PlaceholderPage title="Qualidade" />} />
        <Route path="settings" element={<PlaceholderPage title="Configurações" />} />
        <Route path="system" element={<PlaceholderPage title="Sistema" />} />

        {/* Rota de fallback, redireciona para a dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};