import { NestFactory } from "@nestjs/core";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce<{ [key: string]: string[] }>((acc, err) => {
          if (err.constraints) {
            acc[err.property] = acc[err.property] || [];
            for (const key of Object.keys(err.constraints)) {
              acc[err.property].push(err.constraints[key]);
            }
          }
          return acc;
        }, {});
        return new BadRequestException({ inputErrors: formattedErrors });
      },
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: "http://localhost:3000",
  });

  await app.listen(4000);
}
bootstrap();
