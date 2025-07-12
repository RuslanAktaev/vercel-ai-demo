'use-client';

import { createTogetherAI } from '@ai-sdk/togetherai';
import { generateObject, experimental_generateImage as generateImage, GeneratedFile } from 'ai';
import Image from 'next/image';
import { ChangeEvent, ReactElement, useState } from 'react';
import { z } from 'zod';

const togetherAi = createTogetherAI({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY,
});

export function TestComponent(): ReactElement {
  const [text, setText] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isIllustrationGenerating, setIsIllustrationGenerating] = useState(false);

  const [result, setResult] = useState<{
    mood: string;
    moodDescription: string;
    emoji: string;
  } | null>(null);
  const [illustration, setIllustration] = useState<GeneratedFile | null>(null);

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

      setIsProcessing(false);
      setResult(object);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleGenerateIllustration = async (): Promise<void> => {
    setIsIllustrationGenerating(true);

    try {
      const { images } = await generateImage({
        model: togetherAi.image('black-forest-labs/FLUX.1-schnell-Free'),
        prompt: `Generate illustration from text: ${text}`,
      });
      setIllustration(images[0]);
      setIsIllustrationGenerating(false);
    } catch (error) {
      console.error(error);
      setIsIllustrationGenerating(false);
    }
  };

  return (
    <div>
      {result && (
        <p>
          {result.emoji}: {result.moodDescription}
        </p>
      )}
      <p>
        {illustration && (
          <Image
            src={`data:${illustration.mimeType};base64,${illustration.base64}`}
            alt='Illustration'
            width={400}
            height={400}
          />
        )}
      </p>
      <div>
        <textarea disabled={isProcessing || isIllustrationGenerating} value={text} onChange={handlePromptChange} />
      </div>
      {isProcessing ? 'Processing...' : <button onClick={handleAskPress}>Evaluate the text</button>}
      {isIllustrationGenerating ? (
        'Processing...'
      ) : (
        <button disabled={!text} onClick={handleGenerateIllustration}>
          Generate illustration
        </button>
      )}
    </div>
  );
}
