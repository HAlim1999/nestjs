import { Module } from '@nestjs/common';
import { ErrorService } from './errors.service';
import { ErrorLoggerServices } from './errors-logger.service';
import { ErrorLogController } from './error.controller';

@Module({
    controllers:[ErrorLogController],
    providers:[ErrorService, ErrorLoggerServices],
    exports: [ErrorService,ErrorLoggerServices]
})
export class ErrorsModule {}
