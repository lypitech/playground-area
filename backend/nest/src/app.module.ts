import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
    imports: [],
    controllers: [AppController, ApiController],
    providers: [ApiService],
})
export class AppModule {}