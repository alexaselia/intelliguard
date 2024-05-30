// src/components/ui/Modal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <Button onClick={onRequestClose} className="absolute top-0 right-0 p-2">Close</Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
