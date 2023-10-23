import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

import { DatabaseModule } from "@/database/database.module";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";

describe("MessageController", () => {
  let controller: MessageController;
  let service: MessageService;

  const mockUsers = [
    { id: "mock-user-id-1", username: "mock-username-1", password: "mock-password-1", createdAt: new Date() },
    { id: "mock-user-id-2", username: "mock-username-2", password: "mock-password-2", createdAt: new Date() },
  ];
  const mockSessions = [
    { id: "mock-session-id-1", title: "mock-session-title-1", ownerId: mockUsers[1].id, createdAt: new Date() },
  ];
  const mockMessages = [
    { id: "mock-message-id-1", msg: "mock-message-msg-1", sessionId: "mock-session-id-1", createdAt: new Date() },
    { id: "mock-message-id-2", msg: "mock-message-msg-2", sessionId: "mock-session-id-2", createdAt: new Date() },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [MessageService],
      imports: [DatabaseModule],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  describe("get messages", () => {
    it("get all messages for a session which does not exist", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => null);
      await expect(controller.getAll(mockUsers[0], { sessionId: "mock-session-id" })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("get all messages for a session which the user does not own", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);
      await expect(controller.getAll(mockUsers[0], { sessionId: "mock-session-id" })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it("get all messages for a session", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);
      jest.spyOn(service, "getMessages").mockImplementationOnce(async () => mockMessages);
      await expect(controller.getAll(mockUsers[1], { sessionId: "mock-session-id" })).resolves.toBe(mockMessages);
    });
  });

  describe("create message", () => {
    it("create message for a session which does not exist", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => null);
      await expect(
        controller.create(mockUsers[0], { msg: "mock-msg-1", sessionId: "mock-session-id" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("create message for a session which the user does not own", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);
      await expect(
        controller.create(mockUsers[0], { msg: "mock-msg-1", sessionId: "mock-session-id" }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("create a message for a session", async () => {
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);
      jest.spyOn(service, "createMessage").mockImplementationOnce(async () => mockMessages[0]);
      await expect(controller.create(mockUsers[1], { msg: "mock-msg-1", sessionId: "mock-session-id" })).resolves.toBe(
        mockMessages[0],
      );
    });
  });

  describe("delete message", () => {
    it("delete a message which does not exist", async () => {
      jest.spyOn(service, "getMessage").mockImplementationOnce(async () => null);

      await expect(controller.delete(mockUsers[0], { id: "mock-message-id" })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("delete a message which the user does not own", async () => {
      const msg = {
        ...mockMessages[0],
        session: {
          ownerId: mockUsers[1].id,
        },
      };
      jest.spyOn(service, "getMessage").mockImplementationOnce(async () => msg);
      jest.spyOn(service, "getSession").mockImplementationOnce(async () => mockSessions[0]);

      await expect(controller.delete(mockUsers[0], { id: "mock-message-id" })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it("delete a message", async () => {
      const msg = {
        ...mockMessages[0],
        session: {
          ownerId: mockUsers[1].id,
        },
      };
      jest.spyOn(service, "getMessage").mockImplementationOnce(async () => msg);
      jest.spyOn(service, "deleteMessage").mockImplementationOnce(async () => mockMessages[0]);

      await expect(controller.delete(mockUsers[1], { id: "mock-session-id" })).resolves.toBe(mockMessages[0]);
    });
  });
});
