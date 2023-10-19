import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { GetUser } from "src/user/decorators/user.decorator";
import { IsLoggedInGuard } from "../auth/guards/isLoggedIn.guard";
import { SessionService } from "./session.service";
import { CreateSessionInputDto, DeleteSessionInputDto } from "./dto";

@Controller("session")
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get()
  @UseGuards(IsLoggedInGuard)
  async getAll(@GetUser() user: User) {
    return this.sessionService.getSessions(user.id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(IsLoggedInGuard)
  async create(@GetUser() user: User, @Body() input: CreateSessionInputDto) {
    return this.sessionService.createSession({
      owner: {
        connect: {
          id: user.id,
        },
      },
      title: input.title,
    });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete()
  @UseGuards(IsLoggedInGuard)
  async delete(@GetUser() user: User, @Body() input: DeleteSessionInputDto) {
    const session = await this.sessionService.getSession(input.id);
    if (session === null) {
      return;
    }
    if (session.ownerId !== user.id) {
      throw new ForbiddenException("You don't own this session!");
    }

    return this.sessionService.deleteSession(input.id);
  }
}
