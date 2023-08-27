import { IsNotEmpty } from "class-validator";


export class SigninDto{

    @IsNotEmpty({message:'Ingrese Mail o password validos'})
    readonly email: string;

    
    @IsNotEmpty({message:'Ingrese Mail o password validos'})
    readonly password: string;
}