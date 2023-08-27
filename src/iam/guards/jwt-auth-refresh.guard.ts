import { Injectable } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { IS_PUBLIC } from "../decorators/is-public.decorator";

Injectable();
export class JwtAuthRefreshGuard extends AuthGuard("jwt-refresh") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canACtivate(context: ExecutionContextHost) {
    const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}