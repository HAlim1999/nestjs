import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from "./entities/user.entity";
import { UserSchema } from "./entities/user.entity";
import { HashingService } from 'src/providers/hashing/hashing.service';
import { BcryptService } from 'src/providers/hashing/bcrypt.service';
import { ErrorsModule } from 'src/errors/errors.module';
import { IamModule } from 'src/iam/iam.module';

@Module({
  imports: [
    ErrorsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    IamModule
  ],
  controllers: [UsersController],
  providers: [{provide: HashingService, useClass: BcryptService},UsersService],
  exports:[UsersService]
})
export class UsersModule {}
