'use-client';

import { createTogetherAI } from '@ai-sdk/togetherai';
import { generateObject } from 'ai';
import { ChangeEvent, ReactElement, useState } from 'react';
import { z } from 'zod';

const togetherAi = createTogetherAI({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY,
});

export function TestComponent(): ReactElement {
  const [text, setText] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    mood: string;
    moodDescription: string;
    emoji: string;
  } | null>(null);

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const handleAskPress = async (): Promise<void> => {
    setIsProcessing(true);

    try {
      const { object } = await generateObject({
        model: togetherAi('meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'),
        system: 'You evaluating user text mood',
        prompt: `Evaluate user's text mood. User's text: ${text}.`,
        schema: z.object({
          mood: z.string(),
          moodDescription: z.string(),
          emoji: z.string(),
        }),
      });

      setText('');
      setIsProcessing(false);
      setResult(object);
    } catch (error) {
      console.error(error);
      setText('');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {result && (
        <p>
          {result.emoji}: {result.moodDescription}
        </p>
      )}
      <div>
        <textarea value={text} onChange={handlePromptChange} />
      </div>
      {isProcessing ? 'Processing...' : <button onClick={handleAskPress}>Evaluate the text</button>}
    </div>
  );
}
