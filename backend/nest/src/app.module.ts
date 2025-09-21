import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://mongo:27017/nestdb"),
    AuthModule,
  ],
  controllers: [AppController, ApiController],
  providers: [ApiService],
})
export class AppModule {}
