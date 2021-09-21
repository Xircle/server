import { ReservationUtilService } from './../utils/reservation/reservation-util.service';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { JwtStrategy } from './../auth/jwt.strategy';
import { User } from './../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlaceUtilService } from './../utils/place/place-util.service';
import { ReservationService } from './../reservation/reservation.service';
import { S3Service } from 'src/aws/s3/s3.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { Place } from './entities/place.entity';
import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceDetail, Reservation, User])],
  providers: [
    PlaceService,
    PlaceUtilService,
    S3Service,
    ReservationUtilService,
    CurrentUserInterceptor,
    ConfigService,
  ],
  controllers: [PlaceController],
})
export class PlaceModule {}
