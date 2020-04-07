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

  private async consumeReceiveAndDelete() {
    if (!this.receiver || !this.client ||  !this.sbClient) {
      console.log("[Consumer]consume no receiver or client");
      return;
    }

    try {
      console.log("[Consumer]consumeReceiveAndDelete Receiving messages...");
      const messages = await this.receiver.receiveMessages(10);
      console.log("[Consumer]consume Received messages:");
      messages.forEach((msg: ServiceBusMessage, index)  => {
        console.log('[Consumer]consume ', index, '\n\tlabel= ',  msg.label, '\n\tmeesageId= ', msg.messageId, '\n\tuserProperties= ',  msg.userProperties, '\n\tbody = ', msg.body, '\n\n\t');
      });
      console.log("[Comsumer]consume ==================");
      await this.client.close();
    
    } catch (error){
      console.log("[Consumer]consume Error occurred: ", error);
    
    } finally {
      await this.sbClient.close();
    }
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

  public async consume(options: APIOptions) {
    this.createClientAndReceiver(options.useQueue, options.sessionId);
    this.consumeReceiveAndDelete();

    //this.consumePeekLock();
  }

}

const consumer = new Consumer();

export default consumer;
 
