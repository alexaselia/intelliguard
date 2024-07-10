// components/ShareSettings.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface ShareSettingsProps {
  share: boolean;
  shareDistance: number;
  hasSharedCameras: boolean;
  onShareChange: (checked: boolean) => void;
  onShareDistanceChange: (value: number) => void;
}

const ShareSettings: React.FC<ShareSettingsProps> = ({
  share,
  shareDistance,
  hasSharedCameras,
  onShareChange,
  onShareDistanceChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 pb-2">Compartilhar</label>
      <div className="flex items-center space-x-2">
        <Switch
          id="share-switch"
          checked={share}
          onCheckedChange={onShareChange}
          className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
            share ? 'bg-white' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm font-medium text-gray-400">
          {share ? 'Sim' : 'Não'}
        </span>
      </div>
      <TransitionGroup>
        {share && !hasSharedCameras && (
          <CSSTransition timeout={300} classNames="fade">
            <Alert className="mt-4">
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Atenção!</AlertTitle>
              <AlertDescription>
                Para ver as câmeras da comunidade, você precisa compartilhar ao menos uma câmera própria. Ligue o compartilhamento de alguma câmera logo abaixo. (:
              </AlertDescription>
            </Alert>
          </CSSTransition>
        )}
      </TransitionGroup>
      <TransitionGroup>
        {share && (
          <CSSTransition timeout={300} classNames="fade">
            <div>
              <label className="block text-sm font-medium text-gray-400 pt-8">Distância de Compartilhamento</label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[shareDistance]}
                  min={50}
                  max={1000}
                  step={10}
                  className="w-[60%]"
                  onValueChange={(values) => onShareDistanceChange(values[0])}
                />
                <input
                  type="number"
                  value={shareDistance}
                  min={50}
                  max={1000}
                  onChange={(e) => onShareDistanceChange(Number(e.target.value))}
                  className="w-20 p-2 border border-gray-700 rounded bg-background text-white"
                />
                <label className="block text-sm font-medium text-gray-400">Metros</label>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default ShareSettings;
