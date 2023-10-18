import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { SessionModule } from "./session/session.module";
import { MessageModule } from "./message/message.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    SessionModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
