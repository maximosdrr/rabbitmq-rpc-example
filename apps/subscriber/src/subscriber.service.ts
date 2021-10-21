import { Injectable } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class SubscriberService {
  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'topic',
    queue: 'subscribe-queue',
  })
  public async pubSubHandler(msg) {
    console.log(`Received message: ${msg}`);
  }

  @RabbitRPC({
    exchange: 'exchange1',
    routingKey: 'rpc-topic',
    queue: 'rpc-queue',
  })
  public async rpcHandler(msg) {
    console.log(msg);
    const randomNum = this.getRandomInt(1, 10);
    await sleep(5000);

    const authorized = randomNum < 5;

    return {
      authorized,
      randomNum,
    };
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
