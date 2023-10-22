import { Injectable } from "@nestjs/common";

import { Prisma, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "argon2";
import { v4 as uuidv4 } from "uuid";

import { DatabaseService } from "@/database/database.service";

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  async createUser(input: Prisma.UserCreateInput): Promise<User | null> {
    const hashedPasswd = await hash(input.password);
    try {
      const user = await this.db.user.create({
        data: {
          username: input.username,
          password: hashedPasswd,
        },
      });
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
        return null;
      }

      throw err;
    }
  }

  async getUser(username: string): Promise<User | null> {
    return await this.db.user.findUnique({ where: { username } });
  }

  async login(username: string): Promise<string> {
    const id = uuidv4();

    await this.db.loginSession.create({
      data: {
        id,
        username,
      },
    });

    return id;
  }

  async logout(sessId: string) {
    await this.db.loginSession.delete({
      where: {
        id: sessId,
      },
    });
  }
}
