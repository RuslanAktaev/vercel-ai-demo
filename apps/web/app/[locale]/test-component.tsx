'use-client';

import { generateText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { ReactElement, useEffect, useState } from 'react';

const ollamaProvider = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export function TestComponent(): ReactElement {
  const [text, setText] = useState<string>('');

  console.log('process.env.NEXT_PUBLIC_APP_ENV', process.env.NEXT_PUBLIC_XAI_API_KEY);

  const getText = async (): Promise<void> => {
    const { text } = await generateText({
      model: ollamaProvider('mistral'),
      prompt: 'Shall I become a gainer?',
    });

    console.log(text);

    setText(text);
  };

  useEffect(() => {
    getText();
  });

  return <div>{text}</div>;
}
