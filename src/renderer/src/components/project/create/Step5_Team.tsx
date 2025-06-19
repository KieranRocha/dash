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

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Equipe do Projeto</h3>
            <p className="text-gray-500">Selecione os membros que farão parte deste projeto.</p>

            <div className="border rounded-md">
                <ul className="divide-y">
                    {availableUsers.map(user => (
                        <li key={user.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id={`user-${user.id}`}
                                    type="checkbox"
                                    checked={team.some(member => member.id === user.id)}
                                    onChange={() => handleToggleUser(user)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor={`user-${user.id}`} className="ml-3 block text-sm">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-gray-500">{user.role}</p>
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};