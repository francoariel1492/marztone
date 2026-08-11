export interface AppConfig {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  security: {
    maxLoginAttempts: number;
    lockMinutes: number;
  };
  mail: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
    to: string;
  };
  storage: {
    provider: 'local' | 'cloudinary';
    maxFileSizeMb: number;
    localDir: string;
    publicUrl: string;
    cloudinary: {
      cloudName: string;
      apiKey: string;
      apiSecret: string;
    };
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret_change_me',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
  },
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS ?? '5', 10),
    lockMinutes: parseInt(process.env.LOCK_MINUTES ?? '15', 10),
  },
  mail: {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    password: process.env.SMTP_PASSWORD ?? '',
    from: process.env.MAIL_FROM ?? 'MarzTone Website <no-reply@marztone.com>',
    to: process.env.MAIL_TO ?? 'contacto@marztone.com',
  },
  storage: {
    provider: (process.env.STORAGE_PROVIDER as 'local' | 'cloudinary') ?? 'local',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '5', 10),
    localDir: process.env.STORAGE_LOCAL_DIR ?? 'uploads',
    // En Railway usa el dominio público automáticamente; en local, localhost.
    publicUrl:
      process.env.STORAGE_PUBLIC_URL ??
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/uploads`
        : 'http://localhost:3000/uploads'),
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
      apiKey: process.env.CLOUDINARY_API_KEY ?? '',
      apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
    },
  },
});
