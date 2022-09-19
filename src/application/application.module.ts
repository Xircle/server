import { ApplicationRepository } from './repositories/application.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationRepository])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
