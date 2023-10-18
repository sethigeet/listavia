import { Request, Response } from "express";
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import { LoginInputDto, RegisterInputDto } from "./dto";
import { AuthService } from "./auth.service";
import { IsLoggedInGuard } from "./guards/isLoggedIn.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() dto: RegisterInputDto) {
    try {
      const user = await this.authService.createUser(dto);
      if (user == null) {
        throw new ConflictException("That username is already taken!");
      }

      return;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post("login")
  async login(@Body() dto: LoginInputDto, @Res() res: Response) {
    const valid = await this.authService.checkPassword(dto.username, dto.password);
    if (valid == null) {
      throw new NotFoundException("No user with that username exists!");
    }

    if (!valid) {
      throw new UnauthorizedException("The password given is invalid!");
    }

    // save the login session to db
    const sessId = await this.authService.login(dto.username);
    // set the session id in cookie
    res.cookie("sessId", sessId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    res.send();
  }

  @Get("logout")
  @UseGuards(IsLoggedInGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessId = req.cookies["sessId"];

    // clear the cookie
    res.clearCookie("sessId");
    res.send();

    // Delete login session from db
    if (sessId) {
      await this.authService.logout(sessId);
    }
  }
}
