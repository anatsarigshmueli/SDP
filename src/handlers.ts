import { Request, Response } from 'express';
import producer from './producer';
import consumer  from './consumer';
import { APIOptions } from './interfaces';
import environment from './env';
var url = require('url');


export const rootHandler = (_req: Request, res: Response) => {
  return res.send('API: localhost://send/?queue=true&messages=6&batch=2&concurrent=3&interval=10&sessionId=my-session  localhost//recieve/?queue=true  🤓');
};

const setEnvControlOptions = (query: any) => {
    environment.CONTROL_OPTIONS = {
        USE_QUEUE: query.queue !== undefined ? true : false,
        MESSAGES_COUNT: query.messages ? query.messages : 1,
        INTERVAL: query.interval ? query.interval : 0,      
        BATCH_COUNT: query.batch ? query.batch : 0,    
        SEND_ASYNC: query.sendAsync !== undefined ? true : false, 
        SESSION_ID: query.sessionId !== undefined ? query.sessionId : ''
    }
}

export const sendHandler = async (req: Request, res: Response) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log("\n\n[sendHandler]============  producing message ", query);
    //setEnvControlOptions(query);
    const result = await producer.produce(new APIOptions(query));
    return res.send(result);
  };

export const recieveHandler = async (req: Request, res: Response) => {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log("\n\n[recieveHandler]============  consuming message ", query);
    //setEnvControlOptions(query);
    const result = await consumer.consume(new APIOptions(query));
    return res.json(result);
};