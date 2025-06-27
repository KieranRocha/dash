import React, { useState } from 'react';
import { User } from '../../../types/index';

// Simulação: Em um app real, isso viria de uma API (api.getUsers())
const availableUsers: User[] = [
    { id: 1, name: 'Carlos Silva', email: 'carlos@email.com', role: 'Engineer' },
    { id: 2, name: 'Ana Costa', email: 'ana@email.com', role: 'Engineer' },
    { id: 3, name: 'João Santos', email: 'joao@email.com', role: 'Manager' },
    { id: 4, name: 'Maria Oliveira', email: 'maria@email.com', role: 'Technician' },
    { id: 5, name: 'Pedro Martins', email: 'pedro@email.com', role: 'Engineer' },
];

const roleColors = {
    Engineer: 'bg-blue-100 text-blue-800',
    Manager: 'bg-purple-100 text-purple-800',
    Technician: 'bg-green-100 text-green-800',
};

interface StepProps {
    data: { team?: User[] };
    updateData: (data: { team: User[] }) => void;
}

export const Step5_Team: React.FC<StepProps> = ({ data, updateData }) => {
    const [team, setTeam] = useState<User[]>(data.team || []);

    const handleToggleUser = (user: User) => {
        const isSelected = team.some(member => member.id === user.id);
        const updatedTeam = isSelected
            ? team.filter(member => member.id !== user.id)
            : [...team, user];

        setTeam(updatedTeam);
        updateData({ team: updatedTeam });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900">Equipe do Projeto</h3>
                <p className="text-gray-600 mt-1">Selecione os membros que farão parte deste projeto.</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Selected Team Summary */}
                {team.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-blue-900">
                                    {team.length} {team.length === 1 ? 'membro selecionado' : 'membros selecionados'}
                                </span>
                            </div>
                            <div className="flex -space-x-1">
                                {team.slice(0, 3).map((member) => (
                                    <div
                                        key={member.id}
                                        className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-white"
                                        title={member.name}
                                    >
                                        {getInitials(member.name)}
                                    </div>
                                ))}
                                {team.length > 3 && (
                                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold border border-white">
                                        +{team.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Users */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                        <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h4 className="text-sm font-semibold text-gray-900">Membros Disponíveis</h4>
                    </div>

                    <div className="space-y-2">
                        {availableUsers.map(user => {
                            const isSelected = team.some(member => member.id === user.id);
                            return (
                                <div
                                    key={user.id}
                                    className={`
                                        flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50
                                        ${isSelected ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'}
                                    `}
                                    onClick={() => handleToggleUser(user)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleUser(user)}
                                            className="w-4 h-4 text-blue-600 border border-gray-300 rounded transition-colors"
                                        />

                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs transition-colors
                                            ${isSelected ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}
                                        `}>
                                            {getInitials(user.name)}
                                        </div>

                                        <div>
                                            <h5 className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                {user.name}
                                            </h5>
                                            <p className={`text-xs ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`
                                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                        ${roleColors[user.role as keyof typeof roleColors]}
                                    `}>
                                        {user.role}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};