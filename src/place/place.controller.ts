import { ReviewPayload } from './dtos/edit-place-review-image.dto';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { User } from './../user/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RolesGuard } from './../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { CreatePlaceInput, CreatePlaceOutput } from './dtos/create-place.dto';
import { PlaceService } from './place.service';
import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-location.dto';
import { Roles } from 'src/auth/roles.decorator';
import { GetPlaceByIdOutput } from './dtos/get-place-by-id.dto';
import { CoreOutput } from 'src/common/common.interface';
import { EditPlaceInput } from './dtos/edit-place.dto';

@ApiTags('Place')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '위치별 생성된 장소 보기' })
  async getPlacesByLocation(
    @GetUser() anyUser: User | undefined,
    @Query('location') location: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<GetPlacesByLocationOutput> {
    return this.placeService.getPlacesByLocation(anyUser, location, page);
  }

  @Get(':placeId')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: '장소의 세부정보 보기' })
  async getPlaceById(
    @GetUser() anyUser: User | undefined,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ): Promise<GetPlaceByIdOutput> {
    return this.placeService.getPlaceById(anyUser, placeId);
  }

  @Post('')
  @ApiOperation({ summary: '장소 생성하기' })
  @ApiConsumes('multipart/form-data')
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'reviewImages',
        maxCount: 12,
      },
    ]),
  )
  async createPlace(
    @GetUser() authUser: User,
    @Body() createPlaceInput: CreatePlaceInput,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      reviewImages: Express.Multer.File[];
    },
  ): Promise<CreatePlaceOutput> {
    return this.placeService.createPlace(authUser, createPlaceInput, files);
  }

  @Patch('/:placeId')
  @ApiOperation({ summary: '장소 정보 수정하기 (이미지 제외)' })
  @Roles(['Admin', 'Owner'])
  async editPlace(
    @Param('placeId') placeId: string,
    @Body() editPlaceInput: EditPlaceInput,
  ): Promise<CoreOutput> {
    return this.placeService.editPlace(placeId, editPlaceInput);
  }

  @Patch('/:placeId/review/images')
  @ApiOperation({ summary: '장소 리뷰 사진 변경하기' })
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(FilesInterceptor('reviewImages'))
  async editPlaceReviewImages(
    @Param('placeId') placeId: string,
    @UploadedFiles()
    reviewImages: Express.Multer.File[],
    @Body() reviewPayload: ReviewPayload[],
  ): Promise<CoreOutput> {
    return this.placeService.editPlaceReviewImages(
      placeId,
      reviewImages,
      reviewPayload,
    );
  }

  @Get('/:placeId/participants')
  @ApiOperation({ summary: '해당 장소에 예약한 참가자 리스트 보기' })
  async getPlaceParticipantList(
    @Param('placeId') placeId: string,
  ): Promise<GetPlaceParticipantListOutput> {
    return this.placeService.getPlaceParticipantList(placeId);
  }
}
