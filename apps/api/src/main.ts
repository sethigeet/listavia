import { NestFactory } from "@nestjs/core";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
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

  const config = new DocumentBuilder()
    .setTitle("LISTavia API documentation")
    .setDescription("The documentation for API that runs the LISTavia app")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(4000);
}
bootstrap();
