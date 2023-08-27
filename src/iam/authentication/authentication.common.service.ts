import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { SigninDto } from './DTO/signin-auth';
import { ErrorService } from 'src/errors/errors.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { PayloadToken } from '../models/token.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import  config from 'src/config';

@Injectable()
export class AuthenticationCommonService {
  constructor(
    @Inject(config.KEY) private readonly configService: ConfigType<typeof config>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorService: ErrorService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

generateJwtAccessToken(payload: PayloadToken) {
    try {
      const accessToken = this.jwtService.signAsync(payload, {
        secret: this.configService.session.jwtAccessTokenSecret,
        expiresIn: this.configService.session.jwtAccessTokenExpiresTime,
      });

      return accessToken;
    } catch (error) {
      this.errorService.createError(error);
    }
  }

generateJwtRefreshToken(payload: PayloadToken){
  try{
    const refreshToken = this.jwtService.signAsync(payload,{
      secret: this.configService.session.jwtRefreshTokenSecret,
      expiresIn: this.configService.session.jwtRefreshTokenExpiresTime
    })
    return refreshToken

  }catch(error){
    this.errorService.createError(error)
  }
}


  async findUserToAuthenticated(payload: SigninDto) {
    try {
      const user = await this.userModel.findOne({ email: payload.email.trim()}).exec();

      if (!user) {
        throw new BadRequestException('Ingrese usuario o password validos');
      }

      const isPasswordMatched = await this.hashingService.compare(
        payload.password.trim(),
        user.password,
      );

      if (!isPasswordMatched) {
        throw new BadRequestException('Ingrese usuario o password validos');
      }

      return user;
    } catch (error) {}
  }

  async findUserAutenticated(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      this.errorService.createError(error);
    }
  }
}
