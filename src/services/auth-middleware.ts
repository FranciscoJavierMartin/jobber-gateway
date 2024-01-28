import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import {
  BadRequestError,
  IAuthPayload,
  UnauthorizedError,
} from '@franciscojaviermartin/jobber-shared';
import { config } from '@gateway/config';

class AuthMiddleware {
  constructor() {}

  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new UnauthorizedError(
        'Token is not available. Please login again',
        'GatewayService verifyUser() method error'
      );
    }

    try {
      const payload: IAuthPayload = verify(
        req.session.jwt,
        config.JWT_TOKEN
      ) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new UnauthorizedError(
        'Token is not available. Please login again',
        'GatewayService verifyUser() method error'
      );
    }

    next();
  }

  public checkAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    if (!req.currentUser) {
      throw new BadRequestError(
        'Authentication is required to access this route.',
        'GatewayService checkAuthentication() method error'
      );
    }

    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
