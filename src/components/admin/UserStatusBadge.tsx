
import React from 'react';

interface UserStatusBadgeProps {
  status: string;
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    suspended: { label: 'Suspenso', color: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default UserStatusBadge;
