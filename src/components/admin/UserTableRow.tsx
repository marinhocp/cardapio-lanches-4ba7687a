
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import UserStatusBadge from './UserStatusBadge';
import UserTypeIcon from './UserTypeIcon';
import UserActionButtons from './UserActionButtons';

interface UserProfile {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  user_type: 'admin' | 'user';
  role: string;
  created_at: string;
}

interface UserTableRowProps {
  user: UserProfile;
  onUpdateStatus: (userId: string, status: 'pending' | 'approved' | 'rejected' | 'suspended') => void;
  onUpdateUserType: (userId: string, userType: 'admin' | 'user') => void;
}

const UserTableRow = ({ user, onUpdateStatus, onUpdateUserType }: UserTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>
        <UserTypeIcon userType={user.user_type} />
      </TableCell>
      <TableCell>
        <UserStatusBadge status={user.status} />
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>
        <UserActionButtons
          user={user}
          onUpdateStatus={onUpdateStatus}
          onUpdateUserType={onUpdateUserType}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
