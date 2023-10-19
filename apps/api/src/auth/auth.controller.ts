import { Request, Response } from "express";
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { verify } from "argon2";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async register(@Body() input: RegisterInputDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.createUser(input);
    if (user == null) {
      throw new ConflictException("That username is already taken!");
    }

    // save the login session to db
    const sessId = await this.authService.login(input.username);
    // set the session id in cookie
    res.cookie("sessId", sessId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return {
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Post("login")
  async login(@Body() input: LoginInputDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.getUser(input.username);
    if (user == null) {
      throw new NotFoundException("No user with that username exists!");
    }

    const valid = await verify(user.password, input.password);
    if (!valid) {
      throw new UnauthorizedException("The password given is invalid!");
    }

    // save the login session to db
    const sessId = await this.authService.login(input.username);
    // set the session id in cookie
    res.cookie("sessId", sessId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    return {
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Get("logout")
  @UseGuards(IsLoggedInGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessId = req.cookies["sessId"];

    // clear the cookie
    res.clearCookie("sessId");

    // Delete login session from db
    if (sessId) {
      await this.authService.logout(sessId);
    }

    return true;
  }
}
