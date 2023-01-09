import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModel } from './user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider(request, rawJtwToken, done) {
        done(null, this.configService.get('SECRET'));
      },
    });
  }

  async validate(payload: any): Promise<UserModel> {
    return { sub: payload.sub, username: payload.username };
  }
}
