// components/UserSettings.tsx
import React from 'react';

interface UserSettingsProps {
  userName: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userName }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400">Nome</label>
      <p className="text-lg font-semibold text-white">{userName}</p>
    </div>
  );
};

export default UserSettings;
