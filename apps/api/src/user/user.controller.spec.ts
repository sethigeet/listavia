import { Test, TestingModule } from "@nestjs/testing";

import { DatabaseModule } from "@/database/database.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  const mockUsers = [
    { id: "mock-user-id-1", username: "mock-username-1", password: "mock-password-1", createdAt: new Date() },
    { id: "mock-user-id-2", username: "mock-username-2", password: "mock-password-2", createdAt: new Date() },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
      imports: [DatabaseModule],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe("get me", () => {
    it("get me", async () => {
      const user = mockUsers[0];
      await expect(controller.me(user)).resolves.toStrictEqual({
        user: {
          id: user.id,
          username: user.username,
        },
      });
    });
  });
});
