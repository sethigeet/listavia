import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { Request } from "@/types";

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest() as Request;

  return req.user;
});
