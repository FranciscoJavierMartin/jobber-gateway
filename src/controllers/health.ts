import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HealthController {
  public health(_req: Request, res: Response) {
    res.status(StatusCodes.OK).send('API Gateway service is healthy and OK');
  }
}
