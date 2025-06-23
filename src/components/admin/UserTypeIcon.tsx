
import React from 'react';
import { Shield, User } from 'lucide-react';

interface UserTypeIconProps {
  userType: string;
}

const UserTypeIcon = ({ userType }: UserTypeIconProps) => {
  return (
    <div className="flex items-center gap-2">
      {userType === 'admin' ? (
        <Shield size={16} className="text-blue-600" />
      ) : (
        <User size={16} className="text-gray-600" />
      )}
      <span className="capitalize">{userType}</span>
    </div>
  );
};

export default UserTypeIcon;
