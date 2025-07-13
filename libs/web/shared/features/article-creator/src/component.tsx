'use client';

import { createTogetherAI } from '@ai-sdk/togetherai';
import Image from '@tiptap/extension-image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { experimental_generateImage as generateImage, generateObject } from 'ai';
import { clsx } from 'clsx';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  ImageIcon,
} from 'lucide-react';
import { ReactNode, useRef, useState } from 'react';
import * as zod from 'zod';
import { AppButton } from '@vercel-ai-demo/web/shared/ui/ui-kit';

const togetherAi = createTogetherAI({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY,
});

interface ArticleCreatorProps {
  placeholder?: string;
  className?: string;
}

export function ArticleCreator({ className }: ArticleCreatorProps): ReactNode {
  const [content, setContent] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTagsGenerating, setIsTagsGenerating] = useState(false);
  const [tags, setTags] = useState<Array<string>>([]);

  const [isIllustrationGenerating, setIsIllustrationGenerating] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const addImage = (): void => {
    if (!editor) return;
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');

      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');

      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;

      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);

    // Reset the input
    event.target.value = '';
  };

  const handleGenerateTagsPress = async (): Promise<void> => {
    setIsTagsGenerating(true);

    try {
      const { object } = await generateObject({
        model: togetherAi('meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'),
        system: "You generating tags for user's text",
        prompt: `Generate tags for user's text. User's text (html): ${content}.`,
        schema: zod.object({
          tags: zod.array(zod.string()),
        }),
      });

      setIsTagsGenerating(false);
      setTags(object.tags);
    } catch (error) {
      console.error(error);
      setIsTagsGenerating(false);
    }
  };

  const handleGenerateIllustration = async (): Promise<void> => {
    console.log(content);

    setIsIllustrationGenerating(true);

    try {
      const { images } = await generateImage({
        model: togetherAi.image('black-forest-labs/FLUX.1-schnell-Free'),
        prompt: `Generate illustration from text: ${content}`,
        size: '512x512',
      });
      const illustration = images[0];

      if (illustration) {
        editor
          ?.chain()
          .focus()
          .setImage({ src: `data:${illustration.mimeType};base64,${illustration.base64}` })
          .run();
      }

      setIsIllustrationGenerating(false);
    } catch (error) {
      console.error(error);
      setIsIllustrationGenerating(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className='flex justify-center m-[40px]'>
      <div className='max-w-[1000px] flex flex-col gap-[10px]'>
        <div className={clsx('rounded-lg bg-background border border-border', className)}>
          <div className='border-b border-border p-2 flex flex-wrap items-center gap-1'>
            <div className='flex items-center gap-1'>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent')}>
                <Bold className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent')}>
                <Italic className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent')}>
                <Strikethrough className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent')}>
                <Code className='h-4 w-4' />
              </AppButton>
            </div>

            <div className='flex items-center gap-1'>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('heading', { level: 1 }) && 'bg-accent')}>
                <Heading1 className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('heading', { level: 2 }) && 'bg-accent')}>
                <Heading2 className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('heading', { level: 3 }) && 'bg-accent')}>
                <Heading3 className='h-4 w-4' />
              </AppButton>
            </div>

            <div className='flex items-center gap-1'>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-accent')}>
                <List className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={clsx('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-accent')}>
                <ListOrdered className='h-4 w-4' />
              </AppButton>
            </div>

            {/* Quote and Code Block */}
            {/* <div className='flex items-center gap-1'>
          <AppButton
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={clsx('h-8 w-8 p-0', editor.isActive('blockquote') && 'bg-accent')}>
            <Quote className='h-4 w-4' />
          </AppButton>
          <AppButton
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={clsx('h-8 w-8 p-0', editor.isActive('codeBlock') && 'bg-accent')}>
            <Code2 className='h-4 w-4' />
          </AppButton>
        </div> */}

            {/* Link */}
            {/* <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={setLink}
            className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-accent')}>
            <LinkIcon className='h-4 w-4' />
          </Button>

        </div> */}

            <AppButton variant='ghost' size='sm' onClick={addImage} className='h-8 w-8 p-0'>
              <ImageIcon className='h-4 w-4' />
            </AppButton>

            <input ref={fileInputRef} type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />

            {/* <UISeparator orientation='vertical' className='h-6' /> */}

            {/* Undo/Redo */}
            <div className='flex items-center gap-1'>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className='h-8 w-8 p-0'>
                <Undo className='h-4 w-4' />
              </AppButton>
              <AppButton
                variant='ghost'
                size='sm'
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className='h-8 w-8 p-0'>
                <Redo className='h-4 w-4' />
              </AppButton>
            </div>
          </div>

          <EditorContent
            editor={editor}
            className='min-h-[200px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 rounded-b-lg'
          />

          <div className='border-t border-border px-4 py-2 text-sm text-muted-foreground flex justify-between items-center'>
            <div className='text-xs'>
              Use <kbd className='px-1.5 py-0.5 text-xs bg-muted rounded'>Cmd+B</kbd> for bold,{' '}
              <kbd className='px-1.5 py-0.5 text-xs bg-muted rounded'>Cmd+I</kbd> for italic, click{' '}
              <kbd className='px-1.5 py-0.5 text-xs bg-muted rounded'>📷</kbd> to add images
            </div>
          </div>
        </div>
        <div className='flex gap-[10px]'>
          <AppButton isLoading={isIllustrationGenerating} onClick={handleGenerateIllustration}>
            Generate illustration
          </AppButton>

          <AppButton className='grow-1' isLoading={isTagsGenerating} onClick={handleGenerateTagsPress}>
            Generate tags
          </AppButton>
        </div>
        {!!tags.length && (
          <div>
            <p>Tags:</p>
            <div className='flex flex-row flex-wrap gap-2'>
              {tags.map((tag, index) => (
                <div key={index} className='inline-block rounded-md bg-red-50 p-4'>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
