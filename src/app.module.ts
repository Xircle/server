import { AppController } from './app.controller';
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from '../ormconfig';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { S3Module } from '@aws/s3/s3.module';
import { PlaceModule } from '@place/place.module';
import { ReservationModule } from '@reservation/reservation.module';
import { RoomModule } from '@room/room.module';
import { MessageModule } from '@message/message.module';
import { ReviewModule } from '@review/review.module';
import { ChatsModule } from '@chats/chats.module';
import { AdminModule } from '@admin/admin.module';
import { EventModule } from '@event/event.module';
import { HealthModule } from '@health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .default('dev')
          .required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number(),
        DB_NAME: Joi.string().required(),
        KAKAO_ID: Joi.string().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY: Joi.string().required(),
        AWS_SECRET_KEY: Joi.string().required(),
        ADMIN_ACCESS_PASSWORD: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? '.env.dev'
          : process.env.NODE_ENV === 'prod'
          ? '.env.prod'
          : '.env.test',
    }),
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    AuthModule,
    S3Module,
    PlaceModule,
    ReservationModule,
    RoomModule,
    MessageModule,
    ReviewModule,
    ChatsModule,
    AdminModule,
    EventModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
