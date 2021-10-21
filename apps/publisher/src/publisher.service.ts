import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

type RpcResponse = {
  authorized: boolean;
  randomNum: number;
};

@Injectable()
export class PublisherService {
  keywords = ['loja', 'blackfriday', 'roupas', 'tartarugas_sao_legais'];

  constructor(private readonly amqpConnection: AmqpConnection) {}

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async publish() {
    await this.amqpConnection.publish('exchange1', 'orange', 'hello world');

    return { sent: Math.random() };
  }

  async publishRPC() {
    const timeout = 30; //seconds
    try {
      const randomNum = this.getRandomInt(1, 10);
      const isAuthenticated = randomNum < 5;

      if (!isAuthenticated) {
        const rpcResponse = await this.amqpConnection.request<RpcResponse>({
          exchange: 'exchange2',
          routingKey: 'blue',
          payload: {
            username: 'email@rankmyapp.com',
            password: '621251',
          },
          timeout: 1000 * 60 * timeout,
          // correlationId: 'mycorrelationid', you can set your own correlationId here
        });

        if (!rpcResponse.authorized) {
          console.log('Calling recursion', rpcResponse);
          return this.publishRPC();
        }

        return this.keywords;
      }

      return this.keywords;
    } catch (e) {
      //TODO implement catch here
      console.log(e);
    }
  }
}
