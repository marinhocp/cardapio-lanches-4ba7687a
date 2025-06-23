
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, UserX, UserCog } from 'lucide-react';

interface UserActionButtonsProps {
  user: {
    id: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    user_type: 'admin' | 'user';
  };
  onUpdateStatus: (userId: string, status: 'pending' | 'approved' | 'rejected' | 'suspended') => void;
  onUpdateUserType: (userId: string, userType: 'admin' | 'user') => void;
}

const UserActionButtons = ({ user, onUpdateStatus, onUpdateUserType }: UserActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      {user.status !== 'approved' && (
        <Button
          onClick={() => onUpdateStatus(user.id, 'approved')}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <UserCheck size={14} className="mr-1" />
          Aprovar
        </Button>
      )}
      
      {user.status !== 'rejected' && user.status !== 'suspended' && (
        <Button
          onClick={() => onUpdateStatus(user.id, 'rejected')}
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700"
        >
          <UserX size={14} className="mr-1" />
          Rejeitar
        </Button>
      )}

      {user.status === 'approved' && (
        <Button
          onClick={() => onUpdateStatus(user.id, 'suspended')}
          size="sm"
          variant="outline"
          className="text-orange-600 hover:text-orange-700"
        >
          <UserX size={14} className="mr-1" />
          Suspender
        </Button>
      )}

      <Select
        value={user.user_type}
        onValueChange={(value: 'admin' | 'user') => onUpdateUserType(user.id, value)}
      >
        <SelectTrigger className="w-32">
          <div className="flex items-center gap-1">
            <UserCog size={14} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">Usuário</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserActionButtons;
