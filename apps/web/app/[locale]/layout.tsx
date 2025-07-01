import { pick } from 'lodash-es';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { constants } from '../../constants';
import { Providers } from './providers';
import type { Locale } from '@vercel-ai-demo/web/shared/utils/i18n';

export const metadata = {
  title: 'Web',
};

export interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

const locales = constants.locales;

export const generateStaticParams = (): Array<{ locale: Locale }> => locales.map((locale) => ({ locale }));

export default async function RootLayout({ children, params }: RootLayoutProps): Promise<ReactElement> {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name='robots' content={process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'index' : 'noindex'} />
      </head>
      <body>
        <Providers messages={pick(messages, 'web-shared')} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
