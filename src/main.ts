import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { INestMicroservice, LoggerService } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
      package: process.env.SERVICE_NAME,
      protoPath: join(__dirname, `./_proto/${process.env.SERVICE_NAME}.proto`),
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true,
        arrays: true
      }
    }
  });

  app.useLogger(app.get<Logger, LoggerService>(Logger));

  return app.listenAsync();
}
bootstrap();
