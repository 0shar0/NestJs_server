import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Number(process.env.PORT) || 8080);
}
start().then(() => {
  console.log(`Server started on port: ${process.env.PORT || 8080}`);
});
