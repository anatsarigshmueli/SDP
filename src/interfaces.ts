export class Message {
    id: number;
    identity: number; 
    name: string; 
    ban: string;
    time: string;

    constructor(identity: number, name: string, ban: string) {
        this.id = Math.floor(Math.random() * 1000000);
        this.identity = identity;
        this.name = name;
        this.ban = ban;
        this.time = Date.now().toString(); 
    }
}

export class APIOptions {
    useQueue: boolean = false; // true-> use queue otherwise use topic
    messagesCount: number = 1; // how many messages to send/receive
    interval: number = 0;      // ms to wait between send
    batchCount: number = 0;    // how many message to send in batch
    sendAsync: boolean = false; 
    sessionId: string = ''; 

    constructor(query: any) {
        this.useQueue = query.queue !== undefined ? true : false;
        this.messagesCount = query.messages ? query.messages : 1;
        this.interval = query.interval ? query.interval : 0;
        this.batchCount = query.batch ? query.batch : 0;
        this.sendAsync = query.sendAsync !== undefined ? true : false;
        this.sessionId = query.sessionId !== undefined ? query.sessionId : '';
    }
}

export const appParams = {
    options: {
        useQueue: true,
        messagesCount: 1,
        interval: 0,      
        batchCount: 0,    
        sendAsync: false, 
        sessionId:'',
    }
};
