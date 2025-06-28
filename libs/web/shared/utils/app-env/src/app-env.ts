import { AppEnv } from './env';

export type AppEnvName = 'development' | 'production';

export const appEnv = new AppEnv<AppEnvName>((process.env.NEXT_PUBLIC_APP_ENV || 'development') as AppEnvName);
