import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core"; 
import { IS_PUBLIC } from "../decorators/is-public.decorator";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class JwtAuthAccessGuard extends AuthGuard("jwt-access"){
    constructor(private readonly reflector: Reflector){
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());
 
        if (isPublic) {
          return true;
        }
   
        return super.canActivate(context);
      }
} 