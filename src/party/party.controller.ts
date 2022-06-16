import { PartyService } from './party.service';
import { CreatePartyInput, PartyPhotoInput } from './dtos/create-party.dto';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { CoreOutput } from '@common/common.interface';
import { User } from './../user/entities/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../auth/guard/roles.guard';
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '@auth/decorators/get-user.decorator';

@ApiTags('Party')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('party')
export class PartyController {
  constructor(private partyService: PartyService) {}
  @Post('')
  @ApiOperation({ summary: '파티 생성하기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 16,
      },
    ]),
  )
  @UseGuards(RolesGuard)
  @Roles(['Client', 'Admin', 'Owner'])
  async createParty(
    @GetUser() authUser: User,
    @Body() createPartyInput: CreatePartyInput,
    @UploadedFiles() files: PartyPhotoInput,
  ): Promise<CoreOutput> {
    console.log(createPartyInput);
    return this.partyService.createParty(authUser, createPartyInput, files);
  }
}
