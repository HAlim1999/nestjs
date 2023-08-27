import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationCommonService } from "../authentication/authentication.common.service";
import { User } from "src/users/entities/user.entity";
import { SigninDto } from "../authentication/DTO/signin-auth";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local"){
    constructor(private readonly authCommonService: AuthenticationCommonService){
        super({ usernameField: "email", passwordField: "password" });
    };

    async validate(email: string, password: string): Promise<User>{
        const payload: SigninDto = {email, password}
        const user = await this.authCommonService.findUserToAuthenticated(payload);

        return user
    }


    
}