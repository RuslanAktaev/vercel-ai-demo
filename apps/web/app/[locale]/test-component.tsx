'use-client';

import { generateText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import { ChangeEvent, ReactElement, useState } from 'react';

const ollamaProvider = createOllama({
  baseURL: 'http://localhost:11434/api',
});

export function TestComponent(): ReactElement {
  const [prompt, setPrompt] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState<string>('');

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setPrompt(event.target.value);
  };

  const handleAskPress = async (): Promise<void> => {
    setIsProcessing(true);

    try {
      const { text } = await generateText({
        model: ollamaProvider('mistral'),
        prompt,
      });

      setPrompt('');
      setIsProcessing(false);
      setText(text);
    } catch (error) {
      console.error(error);
      setPrompt('');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {text}
      <div>
        <textarea value={prompt} onChange={handlePromptChange} />
      </div>
      {isProcessing ? 'Processing...' : <button onClick={handleAskPress}>Ask!</button>}
    </div>
  );
}
