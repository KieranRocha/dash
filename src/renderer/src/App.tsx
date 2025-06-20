import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ProjectsPage } from './pages/ProjectPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

/**
 * Componente genérico para páginas que estão na sidebar mas ainda não foram criadas.
 * @param {object} props - Propriedades do componente.
 * @param {string} props.title - O título da página a ser exibido.
 * @returns {JSX.Element}
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

        {/* Rota para o visualizador de BOM (baseado no hook useBOM) */}


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