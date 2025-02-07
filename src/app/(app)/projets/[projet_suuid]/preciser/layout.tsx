import { PropsWithChildren } from 'react';
import { QuestionsReponsesProvider } from '@/presentation/ui/ai';

const PreciserLayout = ({ children }: PropsWithChildren) => {
  return <QuestionsReponsesProvider>{children}</QuestionsReponsesProvider>;
};

export default PreciserLayout;
