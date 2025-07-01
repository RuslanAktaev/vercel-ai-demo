import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren, ReactNode } from 'react';

interface IntlProviderProps {
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: IntlProviderProps & PropsWithChildren): ReactNode {
  return (
    <HeroUIProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ToastProvider />
        {children}
      </NextIntlClientProvider>
    </HeroUIProvider>
  );
}
