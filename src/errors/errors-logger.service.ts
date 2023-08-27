import { HttpStatus, Injectable } from "@nestjs/common"
import * as winston from "winston"
import * as fs from "fs";

@Injectable()
export class ErrorLoggerServices{
    private logger: winston.Logger;
    constructor(){
        this.logger = winston.createLogger({
            level: "error",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports:[
                new winston.transports.File({ filename: "logs/error.log"})
            ]
        })
    }
    createErrorLog(message: string, trace?: any | boolean){
        this.logger.error(message, trace);
    }

    getAllErrorLog(){
        try{
           const errorLogContent = fs.readFileSync("logs/error.log", "utf-8"); 
           const errorLogLines = errorLogContent.split("\n");

           const jsonObjectArray = errorLogLines.filter((jsonString) => jsonString.trim() !== "").map((jsonString) => JSON.parse(jsonString.replace( /\r/g, "")));

           return jsonObjectArray;
        }catch(error){
            this.createErrorLog("No se pudo acceder al archivo", HttpStatus.REQUEST_TIMEOUT);
        }
    }

    clearAllErrorLog() {
     const filePath = "logs/error.log";
     try{
        fs.writeFileSync(filePath, "")

        return {message: "Errores eliminados"}
     }catch(error){
        this.createErrorLog("Error al borar el archivo de errores", HttpStatus.REQUEST_TIMEOUT)
        return
     }   
    }
}