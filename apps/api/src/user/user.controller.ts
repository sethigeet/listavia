import { Controller, Get, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { IsLoggedInGuard } from "../auth/guards/isLoggedIn.guard";

import { GetUser } from "./decorators/user.decorator";
import { User } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  @UseGuards(IsLoggedInGuard)
  async me(@GetUser() user: User) {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
