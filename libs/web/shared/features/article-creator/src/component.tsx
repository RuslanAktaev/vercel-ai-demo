import { ReactElement } from 'react';
import { AppButton } from '@vercel-ai-demo/web/shared/ui/ui-kit';

export function ArticleCreator(): ReactElement {
  return (
    <div>
      <AppButton color='success'>Click me</AppButton>
    </div>
  );
}
