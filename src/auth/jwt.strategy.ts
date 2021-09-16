import { ConfigService } from '@nestjs/config';
import { User } from './../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   *
   * 토큰이 유효한지 체크가 되면 validate 메소드에서 db에 저장된 유저 객체를 return한다.
   * return 값은 ```@UseGuards(AuthGuard())```를 사용한 모든 곳에 자동으로 Request 객체로서 들어간다.
   *
   * @param payload
   */
  async validate(payload: any) {
    const { id } = payload;
    const user: User = await this.userRepository.findOne(
      { id },
      {
        select: ['id', 'email', 'isVerified', 'profile', 'role'],
      },
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
