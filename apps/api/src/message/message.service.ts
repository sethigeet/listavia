import { Injectable } from "@nestjs/common";
import { Message, Prisma } from "@prisma/client";

import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MessageService {
  constructor(private db: DatabaseService) {}

  async getSession(id: string) {
    return await this.db.session.findUnique({
      where: {
        id,
      },
    });
  }

  async getMessage(id: string) {
    return await this.db.message.findUnique({
      where: {
        id,
      },
      include: {
        session: {
          select: {
            ownerId: true,
          },
        },
      },
    });
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return await this.db.message.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async createMessage(input: Prisma.MessageCreateInput): Promise<Message> {
    return await this.db.message.create({
      data: input,
    });
  }

  async deleteMessage(id: string): Promise<Message> {
    return await this.db.message.delete({
      where: {
        id,
      },
    });
  }
}
