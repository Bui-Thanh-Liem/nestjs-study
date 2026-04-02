import {
  MiddlewareConsumer,
  Module,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthStrategy } from './strategies/auth.strategy';
import sqliteConfig from './configs/sqlite.config';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';

@Module({
  imports: [
    //
    ConfigModule.forRoot({
      isGlobal: true,
      load: [sqliteConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),

    //
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const sqliteConfig = config.get<TypeOrmModuleOptions>('sqlite') || null;

        if (!sqliteConfig)
          throw new NotFoundException(
            'Database name not found in environment variables',
          );

        return sqliteConfig;
      },
    }),
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthStrategy,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      // chỉ sử dụng jwt hoặc cookie session, không nên dùng cả 2 (hiện tại là học)
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_SESSION_KEY') || 'key-secret'],
          maxAge: 24 * 60 * 60 * 1000,
        }),
      )
      .forRoutes('*');
  }
}
