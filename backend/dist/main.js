import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { json } from 'express';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.use(json({ limit: '6mb' }));
    app.enableCors({
        origin: '*',
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map