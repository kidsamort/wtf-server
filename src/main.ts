import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function start() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
start()
  .then(() => console.log(`success start `))
  .catch((reason) => {
    console.log(`error start ${reason}`);
  });
