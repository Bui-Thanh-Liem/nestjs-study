import {
  MiddlewareConsumer,
  Module,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ReportEntity } from './modules/reports/entities/report.entity';
import { ReportsModule } from './modules/reports/reports.module';
import { UserEntity } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthStrategy } from './strategies/auth.strategy';

@Module({
  imports: [
    //
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),

    //
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
