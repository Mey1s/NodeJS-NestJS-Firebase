import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as serviceAccount from "./firebaseAuth/firebaseServiceAccount.json";
import { ValidationPipe } from '@nestjs/common';

declare global {
  namespace Express {
    interface Request {
      uid?: string
    }
  }
}

async function bootstrap() {  
  //firebase initialize
  admin.initializeApp({
    credential: admin.credential.cert({
      private_key: serviceAccount.private_key,
      client_email: serviceAccount.client_email,
      project_id: serviceAccount.project_id
    } as Partial<admin.ServiceAccount>),
    databaseURL: `${serviceAccount.project_id}.europe-west1.firebasedatabase.app`
  });

  const app = await NestFactory.create(AppModule);

  //enable to use class validator and class transform
  app.useGlobalPipes(new ValidationPipe({}));

  //swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Dating')
    .setDescription('Dating - server side')
    .setVersion('1.0')
    .addTag('dating')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //enable all cors
  app.enableCors();

  await app.listen(3008);
}
bootstrap();
