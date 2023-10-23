import { Request, Response } from "express";
import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { DatabaseModule } from "@/database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { hash } from "argon2";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUsers = [
    { id: "mock-user-id-1", username: "mock-username-1", password: "mock-password-1", createdAt: new Date() },
    { id: "mock-user-id-2", username: "mock-username-2", password: "mock-password-2", createdAt: new Date() },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [DatabaseModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("register with username that is already taken", async () => {
      jest.spyOn(service, "createUser").mockImplementationOnce(async () => null);

      expect(
        controller.register({ username: "username", password: "password" }, {} as Response),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("register with valid inputs", async () => {
      jest.spyOn(service, "createUser").mockImplementationOnce(async () => mockUsers[0]);
      jest.spyOn(service, "login").mockImplementationOnce(async () => "mock-login-session-id-1");

      const cookieFn = jest.fn();
      const res = {
        cookie: cookieFn,
      } as unknown as Response;

      await expect(
        controller.register({ username: mockUsers[0].username, password: mockUsers[0].password }, res),
      ).resolves.toStrictEqual({
        user: {
          id: mockUsers[0].id,
          username: mockUsers[0].username,
        },
      });
      expect(cookieFn).toBeCalledTimes(1);
    });
  });

  describe("login", () => {
    it("login with username that does not exist", async () => {
      jest.spyOn(service, "getUser").mockImplementationOnce(async () => null);
      const cookieFn = jest.fn();
      const res = {
        clearCookie: cookieFn,
      } as unknown as Response;

      await expect(
        controller.login({ username: "mock-username-1", password: "mock-password-1" }, res),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(cookieFn).toBeCalledTimes(0);
    });

    it("login with invalid password", async () => {
      jest.spyOn(service, "getUser").mockImplementationOnce(async () => ({
        ...mockUsers[0],
        password: await hash(mockUsers[0].password),
      }));
      const cookieFn = jest.fn();
      const res = {
        clearCookie: cookieFn,
      } as unknown as Response;

      await expect(
        controller.login({ username: "mock-username-1", password: "wrong-password" }, res),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(cookieFn).toBeCalledTimes(0);
    });

    it("login with valid credentials", async () => {
      jest.spyOn(service, "getUser").mockImplementationOnce(async () => ({
        ...mockUsers[0],
        password: await hash(mockUsers[0].password),
      }));
      jest.spyOn(service, "login").mockImplementationOnce(async () => "mock-login-session-id");
      const cookieFn = jest.fn();
      const res = {
        cookie: cookieFn,
      } as unknown as Response;

      await expect(
        controller.login({ username: mockUsers[0].username, password: mockUsers[0].password }, res),
      ).resolves.toStrictEqual({
        user: {
          id: mockUsers[0].id,
          username: mockUsers[0].username,
        },
      });
      expect(cookieFn).toBeCalledTimes(1);
    });
  });

  describe("logout", () => {
    it("logout without any cookies", async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(service, "logout").mockImplementationOnce(async () => {});

      const req = { cookies: [] } as Request;
      const cookieFn = jest.fn();
      const res = {
        clearCookie: cookieFn,
      } as unknown as Response;

      await expect(controller.logout(req, res)).resolves.toBe(true);
      expect(cookieFn).toBeCalledTimes(1);
    });

    it("logout with cookies", async () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(service, "logout").mockImplementationOnce(async () => {});

      const req = { cookies: [] } as Request;
      const cookieFn = jest.fn();
      const res = {
        clearCookie: cookieFn,
      } as unknown as Response;

      await expect(controller.logout(req, res)).resolves.toBe(true);
      expect(cookieFn).toBeCalledTimes(1);
    });
  });
});
