import { ReactNode, FC } from 'react';

export interface FireflyMagicBGProps {
  children?: ReactNode;
  fireflyCount?: number;
  className?: string;
  colorScheme?: 'purple' | 'rainbow' | 'red' | 'cyan' | 'blue' | 'green' | 'pink';
}

export const FireflyMagicBG: FC<FireflyMagicBGProps>;
export const NeuralNetworkBG: FC<{ children?: ReactNode }>;
export const CodeTypingBG: FC<{ children?: ReactNode }>;
export const GeometricWavesBG: FC<{ children?: ReactNode }>;
