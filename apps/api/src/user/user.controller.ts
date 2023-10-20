import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { UserService } from "./user.service";
import { IsLoggedInGuard } from "../auth/guards/isLoggedIn.guard";

import { GetUser } from "./decorators/user.decorator";
import { User } from "@prisma/client";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  @UseGuards(IsLoggedInGuard)
  @ApiOkResponse({ description: "The details of the user are returned successfully." })
  @ApiUnauthorizedResponse({ description: "You are not authorized to do this action." })
  async me(@GetUser() user: User) {
    return {
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
