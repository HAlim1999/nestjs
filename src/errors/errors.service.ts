import { BadRequestException, Injectable } from "@nestjs/common"


@Injectable()
export class ErrorService {
    createError(error: any){
        if(error.name === "MongoServerError" && error.code === 11000){
        throw new BadRequestException(`El ${Object.keys(error.keyValue)} ya existe`)
        }else{
            throw new BadRequestException(error.message)
        }
    }
}

