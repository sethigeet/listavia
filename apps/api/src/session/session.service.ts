import { Injectable } from "@nestjs/common";
import { Prisma, Session } from "@prisma/client";

import { DatabaseService } from "@/database/database.service";

@Injectable()
export class SessionService {
  constructor(private db: DatabaseService) {}

  async getSession(sessionId: string): Promise<Session | null> {
    return await this.db.session.findUnique({
      where: {
        id: sessionId,
      },
    });
  }

  async getSessions(userId: string): Promise<Session[]> {
    return await this.db.session.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async createSession(input: Prisma.SessionCreateInput): Promise<Session> {
    return await this.db.session.create({
      data: input,
    });
  }

  async deleteSession(id: string): Promise<Session> {
    return await this.db.session.delete({
      where: {
        id,
      },
    });
  }
}
