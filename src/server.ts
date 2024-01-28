import http from 'http';

import {
  Application,
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import { Logger } from 'winston';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import {
  CustomError,
  IErrorResponse,
  winstonLogger,
} from '@franciscojaviermartin/jobber-shared';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elasticsearch';
import { appRoutes } from '@gateway/routes';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'apiGateway',
  'debug'
);

export class GatewayServer {
  constructor(private app: Application) {}

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ limit: '200mb', extended: true }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'The endpoint called does not exist.' });
      next();
    });
    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.log('error', `GatewayService ${error.comingFrom}:`, error);
        if (error instanceof CustomError) {
          res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(config.SERVER_PORT, () => {
        log.info(`Gateway server running on port ${config.SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startHttpServer() error method:', error);
    }
  }
}
