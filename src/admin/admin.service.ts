import { ConfigService } from '@nestjs/config';
import { CoreOutput } from 'src/common/common.interface';
import { VerifyAdminInput } from './dtos/verify-admin.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AdminService {
  private ADMIN_ACCESS_PASSWORD: string;

  constructor(private readonly configService: ConfigService) {
    this.ADMIN_ACCESS_PASSWORD = configService.get('ADMIN_ACCESS_PASSWORD');
  }

  async verifyAdmin({ password }: VerifyAdminInput): Promise<CoreOutput> {
    try {
      if (password === this.ADMIN_ACCESS_PASSWORD) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: '비밀번호가 일치하지 않습니다',
        };
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
