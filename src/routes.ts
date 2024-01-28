import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/heath';

export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
};
