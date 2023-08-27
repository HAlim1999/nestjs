import { IsEmail, IsString, IsNotEmpty, Matches, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;


    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "La contraseña debe tener letras mayúsculas, minúsculas y números",
      })
    password: string;

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string


    @IsOptional()
    readonly isTfaEnable:boolean;

    @IsOptional()
    readonly tfaSecret:string;

    @IsOptional()
    readonly role: string;

    @IsOptional()
    readonly isDeleted: boolean

}
