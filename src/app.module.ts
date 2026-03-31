import {
  MiddlewareConsumer,
  Module,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CurrentUserInterceptor } from './modules/users/interceptors/current-user.interceptor';
import cookieSession from 'cookie-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportsModule } from './modules/reports/reports.module';
import { ReportEntity } from './modules/reports/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const dbName = config.get<string>('DB_NAME') || 'dev.sqlite';

        if (!dbName)
          throw new NotFoundException(
            'Database name not found in environment variables',
          );

        return {
          type: 'sqlite',
          database: dbName,
          entities: [UserEntity, ReportEntity],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({ keys: ['nestjs-study'], maxAge: 24 * 60 * 60 * 1000 }),
      )
      .forRoutes('*');
  }
}
