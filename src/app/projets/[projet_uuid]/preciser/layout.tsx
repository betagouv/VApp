import { PropsWithChildren } from 'react';
import { QuestionsReponsesProvider } from '@/ai';

const PreciserLayout = ({ children }: PropsWithChildren) => {
  return <QuestionsReponsesProvider>{children}</QuestionsReponsesProvider>;
};

export default PreciserLayout;
