import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { EditPlaceReviewImagesInput } from './dtos/edit-place-review-image.dto';
import { GetPlaceParticipantListOutput } from './dtos/get-place-participant-list.dto';
import { CreatePlaceInput, CreatePlaceOutput } from './dtos/create-place.dto';
import { PlaceService } from './place.service';
import {
  GetPlacesOutput,
  GetPlacesWhereOptions,
} from './dtos/get-place-by-location.dto';
import { GetPlaceByIdOutput } from './dtos/get-place-by-id.dto';
import { EditPlaceInput } from './dtos/edit-place.dto';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { RolesGuard } from '@auth/guard/roles.guard';
import { Roles } from '@auth/roles.decorator';
import { CoreOutput } from '@common/common.interface';
import { PlaceType } from './entities/place.entity';

@ApiTags('Place')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) {}

  @Get('')
  @ApiOperation({ summary: '장소의 Type, Location 별로 생성된 장소 보기' })
  async getPlaces(
    @Query('location') location: string,
    @Query('placeType') placeType: PlaceType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ): Promise<GetPlacesOutput> {
    console.debug(location, placeType);
    return this.placeService.getPlaces(location, placeType, page, limit);
  }

  @Get(':placeId')
  @ApiOperation({ summary: '장소의 세부정보 보기' })
  async getPlaceById(
    @GetUser() anyUser: User | undefined,
    @Param('placeId', new ParseUUIDPipe()) placeId: string,
  ): Promise<GetPlaceByIdOutput> {
    return this.placeService.getPlaceById(anyUser, placeId);
  }

  @Post('')
  @ApiOperation({ summary: '장소 생성하기' })
  @UseGuards(RolesGuard)
  @Roles(['Client', 'Admin', 'Owner'])
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'coverImage',
        maxCount: 1,
      },
      {
        name: 'subImages',
        maxCount: 8,
      },
    ]),
  )
  async createPlace(
    @GetUser() authUser: User,
    @Body() createPlaceInput: CreatePlaceInput,
    @UploadedFiles()
    files: {
      coverImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
  ): Promise<CreatePlaceOutput> {
    const { coverImage, subImages } = files;
    if (!coverImage || !subImages)
      return {
        ok: false,
        error: '대표 음식사진 혹은, 서브 음식사진들을 업로드 해주세요.',
      };
    return this.placeService.createPlace(authUser, createPlaceInput, files);
  }

  @Patch('/:placeId')
  @ApiOperation({ summary: '장소 정보 수정하기 (리뷰 제외)' })
  @UseGuards(RolesGuard)
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(FileInterceptor('coverImage'))
  async editPlace(
    @Param('placeId') placeId: string,
    @Body() editPlaceInput: EditPlaceInput,
    @UploadedFile() coverImage: Express.Multer.File,
  ): Promise<CoreOutput> {
    return this.placeService.editPlace(placeId, editPlaceInput, coverImage);
  }

  // TODO: 리뷰 사진이 아니라 SubImage, coverImage Edit API 만들기
  @Patch('/:placeId/review/:reviewId')
  @ApiOperation({ summary: '장소 정보 수정하기 (리뷰 정보 변경하기)' })
  @UseGuards(RolesGuard)
  @Roles(['Admin', 'Owner'])
  @UseInterceptors(FilesInterceptor('reviewImages'))
  async editPlaceReviewImages(
    @Param('placeId', ParseUUIDPipe) placeId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @UploadedFiles()
    reviewImages: Express.Multer.File[],
    @Body() editPlaceReviewImagesInput: EditPlaceReviewImagesInput,
  ): Promise<CoreOutput> {
    return { ok: true };
    // return this.placeService.editPlaceReviewImages(
    //   placeId,
    //   reviewId,
    //   reviewImages,
    //   editPlaceReviewImagesInput,
    // );
  }

  @Get('/:placeId/participants')
  @ApiOperation({ summary: '해당 장소에 예약한 참가자 리스트 보기' })
  async getPlaceParticipantList(
    @Param('placeId') placeId: string,
  ): Promise<GetPlaceParticipantListOutput> {
    return this.placeService.getPlaceParticipantList(placeId);
  }
}
