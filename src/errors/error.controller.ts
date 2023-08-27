import { Controller, Get, Post } from "@nestjs/common";
import { ErrorLoggerServices } from "./errors-logger.service";

@Controller("error-log")
export class ErrorLogController{
    constructor(private readonly erroLoggerService: ErrorLoggerServices){}

    @Get("all")
    getAllErrorLog(){
        const errorList = this.erroLoggerService.getAllErrorLog();
        return {errorList}
    }

    @Post()
    clearAllErrorLog(){
        return this.erroLoggerService.clearAllErrorLog();
    }

}

