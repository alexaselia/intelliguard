// components/AvatarUploader.tsx
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AvatarUploaderProps {
  avatarUrl: string | null;
  userName: string;
  onImageUpload: (file: File) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ avatarUrl, userName, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-32 h-32 cursor-pointer">
            <AvatarImage src={avatarUrl || ''} alt={userName || 'Avatar'} />
            <AvatarFallback>{userName ? userName.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="focus:bg-gray-700 focus:bg-opacity-20" onSelect={() => fileInputRef.current?.click()}>
            Trocar imagem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export default AvatarUploader;
