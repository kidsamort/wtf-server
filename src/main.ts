import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import * as session from 'express-session';
async function start() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.REACT_APP_URL,
      credentials: true,
    },
  });
  app.setGlobalPrefix('api');
  // app.use(
  //   session({
  //     cookie: {
  //       secure: true,
  //       maxAge: 86400,
  //       sameSite: 'none',
  //     },
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
start()
  .then(() => console.log(`success start `))
  .catch((reason) => {
    console.log(`error start ${reason}`);
  });
