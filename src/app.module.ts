import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreModule } from './firestore/firestore.module';
import * as serviceAccount from "./firebaseAuth/firebaseServiceAccount.json";
import { UsersModule } from './components/users/users.module';
import { RolesModule } from './components/roles/roles.module';
import { GendersModule } from './components/genders/genders.module';
import { CountriesModule } from './components/countries/countries.module';
import { QuestionsModule } from './components/questions/questions.module';
import { ImagesModule } from './components/images/images.module';
import { RewardsModule } from './components/rewards/rewards.module';
import { ChatsModule } from './components/chats/chats.module';
import { MessagesModule } from './components/messages/messages.module';
import { RejectionsModule } from './components/rejections/rejections.module';
import { AuthModule } from './usersAuth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('KEY_FILE_NAME'),
        projectId: configService.get<string>('PROJECT_ID'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    GendersModule,
    CountriesModule,
    QuestionsModule,
    ImagesModule,
    RewardsModule,
    ChatsModule,
    MessagesModule,
    RejectionsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


//Create middlewares

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//       consumer.apply(PreauthMiddleware).forRoutes({
//         path: '*', method: RequestMethod.ALL
//       })
//   }
// }