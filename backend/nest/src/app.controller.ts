import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): string {
        return 'Hello from NestJS';
    }

    @Get('ping')
    ping() {
        return { message: 'pong' };
    }
}
