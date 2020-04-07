import { ServiceBusClient, SendableMessageInfo, QueueClient, Sender, TopicClient } from "@azure/service-bus"; 
import environment from "./env";
import { Utils } from "./utils";
import { APIOptions } from "./interfaces";

class Producer {
  private connectionString: string | undefined;
  private sbClient: ServiceBusClient | undefined;

  private client: QueueClient | TopicClient | undefined;;
  private sender: Sender | undefined;

  // queue
  private queueName: string;
  private queueClient: QueueClient | undefined;
  private queueSender: Sender | undefined;

  //topic
  private topicName: string;
  private topicClient: TopicClient | undefined;
  private topicSender: Sender | undefined;
  
  constructor() {
    this.queueName = environment.QUEUE_NAME;
    this.topicName = environment.TOPIC_NAME;
  }

  private createClientAndSender(queue: boolean) {
    
    if (queue) {
      console.log('[Producer]createClientAndSender initializing queue client');
      this.connectionString = environment.QUEUE.PRIMARY_CONNECTION_STRING;
      this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString); 
      this.queueClient = this.sbClient.createQueueClient(this.queueName);
      this.queueSender = this.queueClient.createSender();
      this.client = this.queueClient;
      this.sender = this.queueSender;
  
    } else {
      console.log('[Producer]createClientAndSender initializing topic client');
      this.connectionString = environment.TOPIC.PRIMARY_SEND_CONNECTION_STRING;
      this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString); 
      this.topicClient = this.sbClient.createTopicClient(this.topicName);
      this.topicSender = this.topicClient.createSender();
      this.client = this.topicClient;
      this.sender = this.topicSender;
    }
  }

  private createMessage(sessionId: string): SendableMessageInfo {
    const messageData = Utils.createMessageFromTemplate();
    const i = Utils.randomNumber(1000000);
    let message: SendableMessageInfo = {
      body: messageData,
      label: "w2bBBNMS test",
      messageId: Utils.randomString(10),
      userProperties: {
          customPropertyName: `custom property random value ${i}`
     }
    }
    if (sessionId && sessionId !== '') {
       message.sessionId = sessionId;
    }

    return message;
  }

  private async sendMessage(sender: Sender, batchCount: number, sessionId: string, result: string[]) {
    if (batchCount > 1) {
      let messages: SendableMessageInfo[] = []; 
      for (let i=0; i < batchCount; i++) {
        messages.push(this.createMessage(sessionId));
      }
      const str = JSON.stringify(messages);
      result.push(`[Producer]sendMessage batch message:  ${str} ...\n`);
      console.log("[Producer]sendMessage batch message: ", messages , "...");
      await sender.sendBatch(messages);
    } else {
      const msg = this.createMessage(sessionId);
      const str = JSON.stringify(msg);
      result.push(`[Producer]sendMessage message: ${str} ...\n`);
      console.log("[Producer]sendMessage message: ", msg , "...");
      await sender.send(msg);
    }
  }

  private async sendMessageAsync(sender: Sender, batchCount: number, sessionId: string, result: string[]): Promise<void> {
    if (batchCount > 1) {
      let messages: SendableMessageInfo[] = []; 
      for (let i=0; i < batchCount; i++) {
        messages.push(this.createMessage(sessionId));
      }
      const str = JSON.stringify(messages);
      result.push(`[Producer]sendMessageAsync batch message: ${str} ...\n`);
      console.log("[Producer]sendMessageAsync batch message: ", messages , "...");
      return sender.sendBatch(messages);
    } else {
      const msg = this.createMessage(sessionId);
      const str = JSON.stringify(msg);
      result.push(`[Producer]sendMessageAsync message: ${str} ...\n`);
      console.log("[Producer]sendMessageAsync message: ", msg , "...");
      return sender.send(msg);
    }
  }

  private async repeatSendingMessage(sender: Sender, n: number, interval: number, batchCount: number, sessionId: string, result: string[]) {
    let i = 0;
    var refreshId = setInterval(async () => {
      await this.sendMessage(sender, batchCount, sessionId, result);
      if (++i >= n) {
        clearInterval(refreshId);
      }
    }, interval);
    }


  public async produce(options: APIOptions): Promise<string[]> {

    return new Promise<string[]> (async (resolve, reject) => {
      let result: string[] = [];
    
      result.push(`[Producer]produce ${options}\n`);
      console.log('[Producer]produce ', options);
    
      this.createClientAndSender(options.useQueue);

      if (this.sender && this.client && this.sbClient) {
        const n = options.messagesCount ? options.messagesCount : 1;
        try {

          if (options.interval > 0 ) {
            await this.repeatSendingMessage(this.sender, options.messagesCount, options.interval, options.batchCount, options.sessionId, result);
          } else {
            if (options.sendAsync) {
              let promises = [];
              for (let i = 0; i < n; i++) {
                promises.push(this.sendMessageAsync(this.sender, options.batchCount, options.sessionId, result));
              }
              Promise.all(promises)
              .then(async (res) => {
                result.push(`[Producer]produce Async all sent  \n`);
                console.log("[Producer]produce Async all sent ");
                result.push("[Producer]produce message sent - closing\n");
                console.log("[Producer]produce message sent - closing");
                result.push("[Producer]produce ======================\n");
                console.log("[Producer]produce ======================");
                if (this.client) { 
                  await this.client.close() 
                };
                resolve(result);
              })
            .catch((err) => {
                result.push(`[Producer]produce Async Error occurred:  ${err}\n`);
                console.log("[Producer]produce Async Error occurred: ", err);
                resolve(result);
            });
            } else {
              for (let i = 0; i < n; i++) {
                await this.sendMessage(this.sender, options.batchCount, options.sessionId, result);
              }
              result.push("[Producer]produce message sent - closing\n");
              console.log("[Producer]produce message sent - closing");
              result.push("[Producer]produce ======================\n");
              console.log("[Producer]produce ======================");
              await this.client.close();
              resolve(result);
            }
          }
      
        } catch (error) {
          result.push(`[Producer]produce Error occurred:  ${error}`);
          console.log("[Producer]produce Error occurred: ", error);
          resolve(result);
      
        } finally {
          await this.sbClient.close();
        }

      } else {
        result.push("[Producer]produce  no sender or client");
        console.log("[Producer]produce  no sender or client");
        resolve(result);
      }
    });
  }
  
}

const producer = new Producer();

export default producer;
 
