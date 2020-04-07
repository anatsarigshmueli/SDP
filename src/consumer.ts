import { ServiceBusClient, ReceiveMode, QueueClient, TopicClient, Receiver, SubscriptionClient, ServiceBusMessage, SessionReceiverOptions, SessionReceiver, OnMessage, OnError }  from "@azure/service-bus"; 
import environment from "./env";
import { APIOptions } from "./interfaces";

class Consumer {
  private connectionString: string | undefined;
  private sbClient: ServiceBusClient | undefined;
  private receiver: Receiver | SessionReceiver | undefined;
  private client: QueueClient | Receiver | SessionReceiver | undefined;

  // queue
  private queueName: string;
  private queueClient: QueueClient | undefined;
  private queueReceiver: Receiver | SessionReceiver | undefined;

  //topic
  private subscriptionName: string | undefined;
  private topicName: string;
  private subscriptionClient: SubscriptionClient | undefined;
  private topicReceiver: Receiver | SessionReceiver | undefined;
  
  constructor() {
    this.queueName = environment.QUEUE_NAME;
    this.topicName = environment.TOPIC_NAME;
  }

  private createClientAndReceiver(queue: boolean, sessionId: string) {
    if (queue) {
      this.connectionString = environment.QUEUE.PRIMARY_CONNECTION_STRING;
      this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString); 
      this.subscriptionName = environment.SUBSCRIPTION_NAME;
      this.queueClient = this.sbClient.createQueueClient(this.queueName);
      if (sessionId && sessionId !== '') {
        this.queueReceiver = this.queueClient.createReceiver(ReceiveMode.receiveAndDelete, {sessionId: sessionId});
      } else {
        this.queueReceiver = this.queueClient.createReceiver(ReceiveMode.receiveAndDelete);
      }
      this.receiver = this.queueReceiver ;
      this.client = this.queueClient;
    } else {
      this.connectionString = environment.TOPIC.PRIMARY_LISTEN_CONNECTION_STRING;
      this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString); 
      this.subscriptionName = environment.TOPIC.SUBBSCRIPTION;
      this.subscriptionClient = this.sbClient.createSubscriptionClient(this.topicName, this.subscriptionName);
      if (sessionId && sessionId !== '') {
        this.topicReceiver = this.subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete, {sessionId});
      } else {
        this.topicReceiver = this.subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete);
      }
      this.receiver = this.topicReceiver;
      this.client = this.topicReceiver;
    }
  }

  private async consumeReceiveAndDelete(messageCount: number): Promise<string[]> {

    return new Promise<string[]> (async (resolve, reject) => {
      
      let result: string[] = [];
      
      if (this.receiver && this.client && this.sbClient) {
        try {
          result.push("[Consumer]consumeReceiveAndDelete Receiving messages...\n");
          console.log("[Consumer]consumeReceiveAndDelete Receiving messages...\n");
          
          const messages = await this.receiver.receiveMessages(messageCount);
          result.push("[Consumer]consumeReceiveAndDelete Received messages:\n");
          console.log("[Consumer]consumeReceiveAndDelete Received messages:\n");
          
          messages.forEach((msg: ServiceBusMessage, index)  => {
            result.push(`[Consumer]consumeReceiveAndDelete  ${index} \n\tlabel  ${msg.label} \n\tmeesageId=  ${msg.messageId} \n\tuserProperties= ${msg.userProperties} \n\tbody = ${msg.body} \n\n\t`);
            console.log(`[Consumer]consumeReceiveAndDelete  ${index} \n\tlabel  ${msg.label} \n\tmeesageId=  ${msg.messageId} \n\tuserProperties= ${msg.userProperties} \n\tbody = ${msg.body} \n\n\t`);
          });
          result.push("[Comsumer]consumeReceiveAndDelete closing ==================\n");
          console.log("[Comsumer]consumeReceiveAndDelete closing ==================\n");
          
          await this.client.close();
        
        } catch (error){
          result.push(`[Consumer]consumeReceiveAndDelete Error occurred:  ${error}  \n`);
          console.log("[Consumer]consumeReceiveAndDelete Error occurred: ", error);
        
        } finally {
          await this.sbClient.close();
        }

        resolve(result);

      } else {
        result.push("[Consumer]consume Error: no receiver or client\n");
        console.log("[Consumer]consume Error: no receiver or client\n");
        resolve(result);
      }
    });

  }

  private async consumePeekLock() {
    if (!this.receiver || !this.client ||  !this.sbClient) {
      console.log("[Consumer]consumePeekLock no receiver or client");
      return;
    }

    try {
      console.log("[Consumer]consumePeekLock Receiving messages...");
      
      const processError: OnError = async err => {
        console.log("[Consumer]consumePeekLock Error occurred: ", err);
        //await this.client.close();
      };
      
      const processMessage:OnMessage  = async (msg: ServiceBusMessage) => {
        console.log("[Consumer]consumePeekLock Received message:");
        console.log('[Consumer]consumePeekLock ', '\n\tlabel= ',  msg.label, '\n\tsessionId= ', msg.messageId, '\n\tmeeageId= ', msg.messageId, '\n\tuserProperties= ',  msg.userProperties, '\n\tbody = ', msg.body, '\n\n\t');
        console.log("[Comsumer]consume ==================");
        await msg.complete();
        //await this.client.close();
      };
      
      this.receiver.registerMessageHandler(processMessage, processError);

    } catch (error){
      console.log("[Consumer]consume Error occurred: ", error);
    
    } finally {
      await this.sbClient.close();
    }
  }

  public async consume(options: APIOptions) : Promise<string[]> {
    this.createClientAndReceiver(options.useQueue, options.sessionId);
    return this.consumeReceiveAndDelete(options.messagesCount); //this.consumePeekLock();
  }
}

const consumer = new Consumer();
export default consumer;
 
