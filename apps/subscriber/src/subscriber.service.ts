import { Injectable } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class SubscriberService {
  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'orange',
    queue: 'orange-queue',
  })
  public async pubSubHandler(msg, amqpMsg: ConsumeMessage) {
    console.log(`[Orange]: Received message: ${msg}`);
  }

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'red',
    queue: 'red-queue',
  })
  public async pubSubHandler1(msg, amqpMsg: ConsumeMessage) {
    console.log(`[RED]: Received message: ${msg}`);
  }

  @RabbitRPC({
    exchange: 'exchange2',
    routingKey: 'blue',
  })
  public async rpcHandler(msg, amqpMsg: ConsumeMessage) {
    console.log({
      correlationId: amqpMsg.properties.correlationId,
      replyTo: amqpMsg.properties.replyTo,
      msg,
    });
    const randomNum = this.getRandomInt(1, 10);
    await sleep(5000);

    const authorized = randomNum < 5;

    return { authorized, randomNum };
  }

  @RabbitRPC({
    exchange: 'exchange2',
    routingKey: 'green',
  })
  public async rpcHandler2(msg, amqpMsg: ConsumeMessage) {
    console.log({
      correlationId: amqpMsg.properties.correlationId,
      replyTo: amqpMsg.properties.replyTo,
      msg,
    });
    await sleep(3000);

    return {
      another: '',
    };
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
