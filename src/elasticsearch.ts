import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@franciscojaviermartin/jobber-shared';
import { config } from '@gateway/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  config.ELASTIC_SEARCH_URL,
  'apiGatewayElasticConnection',
  'debug'
);

class ElasticSearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: config.ELASTIC_SEARCH_URL,
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected: boolean = false;

    while (!isConnected) {
      log.info('GatewayService connecting to ElasticSearch');

      try {
        const health: ClusterHealthResponse =
          await this.elasticSearchClient.cluster.health({});
        log.info(
          `GatewayService ElasticSearch health status - ${health.status}`
        );
        isConnected = true;
      } catch (error) {
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.log(
          'error',
          'GatewayService checkConnection() method error:',
          error
        );
      }
    }
  }
}

export const elasticSearch: ElasticSearch = new ElasticSearch();
