import { v4 as uuidv4 } from 'uuid';
var fs = require('fs');

export class Utils {

    public static randomString(length: number): string {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    public static randomNumber(n: number): number {
        return Math.floor(Math.random() * n);
    }

    public static createSessionId() {
        return uuidv4();
    }

    public static createMessageFromTemplate(): {} {
        try {
          let rawdata = fs.readFileSync('./src/message.json', 'utf8');
          let data = JSON.parse(rawdata);
          let finalObject: any = {};
          
          let uidName = Utils.randomString(10); //get the random string
          finalObject[uidName] = data.uid; //copy uid object
          finalObject[uidName].time = Date.now();
    
          return finalObject;
        } catch(e) {
          console.log('[Producer]createMessageFromTemplate Error:', e.stack);
          return 'no message';
        }
      }

}