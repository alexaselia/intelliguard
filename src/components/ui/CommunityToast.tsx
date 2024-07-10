// components/ui/CommunityToast.tsx
import { toast } from 'components/ui/toast';
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

const showCommunityToast = () => {
  toast({
    title: 'Atenção',
    description: (
      <div className="flex items-center">
        <CircleAlert className="mr-2" size={24} />
        <span>
          Para ver as câmeras da comunidade, você precisa ter alguma câmera com o compartilhamento ligado. Ajuste suas{' '}
          <Link href="/configuracoes">
            <a className="underline">preferências</a>
          </Link>.
        </span>
      </div>
    ),
    duration: 5000,
    className: 'bg-white text-black border border-gray-300 shadow-lg',
  });
};

export { showCommunityToast };
