import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public JWT_TOKEN: string;
  public GATEWAY_JWT_TOKEN: string;
  public NODE_ENV: string;
  public SECRET_KEY_ONE: string;
  public SECRET_KEY_TWO: string;
  public CLIENT_URL: string;
  public AUTH_BASE_URL: string;
  public USERS_BASE_URL: string;
  public MESSAGE_BASE_URL: string;
  public ORDER_BASE_URL: string;
  public REVIEW_BASE_URL: string;
  public REDIS_HOST: string;
  public ELASTIC_SEARCH_URL: string;
  public SERVER_PORT: number;

  constructor() {
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    this.USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || '';
    this.ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.SERVER_PORT = 4000;
  }
}

export const config: Config = new Config();
