import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ErrorsModule } from './errors/errors.module';
import { IamModule } from './iam/iam.module';
import config from './config';


const configService = new ConfigService();


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV.trim()}.env`,
      isGlobal: true,
      load:[config]
    }),
    MongooseModule.forRoot(configService.get(`MONGO_DB`)),
    UsersModule,
    ErrorsModule,
    IamModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule {}
