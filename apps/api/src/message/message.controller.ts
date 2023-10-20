import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { User } from "@prisma/client";

import { GetUser } from "src/user/decorators/user.decorator";
import { IsLoggedInGuard } from "../auth/guards/isLoggedIn.guard";
import { MessageService } from "./message.service";
import { CreateMessageInputDto, DeleteMessageInputDto, GetMessagesInputDto } from "./dto";

@Controller("message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post("getAll")
  @UseGuards(IsLoggedInGuard)
  @ApiOkResponse({ description: "All the messages for the given session are returned successfully." })
  @ApiUnauthorizedResponse({ description: "You are not authorized to do this action." })
  async getAll(@GetUser() user: User, @Body() input: GetMessagesInputDto) {
    const session = await this.messageService.getSession(input.sessionId);
    if (session === null) {
      throw new NotFoundException("A session with that id does not exist!");
    }

    if (session.ownerId !== user.id) {
      throw new ForbiddenException("You don't own that session!");
    }

    return this.messageService.getMessages(input.sessionId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiCreatedResponse({ description: "The message with the given content was created successfully" })
  @ApiUnauthorizedResponse({ description: "You are not authorized to do this action." })
  async create(@GetUser() user: User, @Body() input: CreateMessageInputDto) {
    const session = await this.messageService.getSession(input.sessionId);
    if (session === null) {
      throw new NotFoundException("A session with that id does not exist!");
    }

    if (session.ownerId !== user.id) {
      throw new ForbiddenException("You don't own that session!");
    }

    return this.messageService.createMessage({
      session: {
        connect: {
          id: input.sessionId,
        },
      },
      msg: input.msg,
    });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post()
  @UseGuards(IsLoggedInGuard)
  @ApiAcceptedResponse({ description: "The message has been successfully deleted." })
  @ApiUnauthorizedResponse({ description: "You are not authorized to do this action." })
  async delete(@GetUser() user: User, @Body() input: DeleteMessageInputDto) {
    const msg = await this.messageService.getMessage(input.id);
    if (msg === null) {
      return;
    }

    if (msg.session.ownerId !== user.id) {
      throw new ForbiddenException("You don't own that message!");
    }

    return this.messageService.deleteMessage(input.id);
  }
}
