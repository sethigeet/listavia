import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { Request } from "src/types";

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(private db: DatabaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const sessId = request.cookies["sessId"];
    if (!sessId) {
      throw new UnauthorizedException("You must be logged in to access this route!");
    }

    const sess = await this.db.loginSession.findUnique({
      where: {
        id: sessId,
      },
      include: {
        user: true,
      },
    });
    if (sess === null) {
      throw new UnauthorizedException("You must be logged in to access this route!");
    }

    request.user = sess.user;
    return true;
  }
}
