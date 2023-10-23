import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

import { DatabaseModule } from "@/database/database.module";
import { SessionController } from "./session.controller";
import { SessionService } from "./session.service";

describe("SessionController", () => {
  let controller: SessionController;
  let service: SessionService;

  const mockUsers = [
    { id: "mock-user-id-1", username: "mock-username-1", password: "mock-password-1", createdAt: new Date() },
    { id: "mock-user-id-2", username: "mock-username-2", password: "mock-password-2", createdAt: new Date() },
  ];
  const mockSessions = [
    { id: "mock-session-id-1", title: "mock-session-title-1", ownerId: mockUsers[1].id, createdAt: new Date() },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [SessionService],
      imports: [DatabaseModule],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    service = module.get<SessionService>(SessionService);
  });

  describe("get sessions", () => {
    it("get all sessions", async () => {
      jest.spyOn(service, "getSessions").mockImplementationOnce(async () => mockSessions);

      await expect(controller.getAll(mockUsers[0])).resolves.toBe(mockSessions);
    });
  });

  describe("create session", () => {
    it("create a session", async () => {
      jest.spyOn(service, "createSession").mockImplementationOnce(async () => mockSessions[0]);

      await expect(controller.create(mockUsers[0], { title: "mock-session-title-1" })).resolves.toBe(mockSessions[0]);
    });
  });

  describe("delete session", () => {
    it("delete a session which does not exist", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => null);

      await expect(controller.delete(mockUsers[0], { id: "mock-message-id" })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("delete a session which the user does not own", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);

      await expect(controller.delete(mockUsers[0], { id: "mock-message-id" })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it("delete a message", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);
      jest.spyOn(service, "deleteSession").mockImplementationOnce(async () => mockSessions[0]);

      await expect(controller.delete(mockUsers[1], { id: "mock-session-id" })).resolves.toBe(mockSessions[0]);
    });
  });
});
