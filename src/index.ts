import express from 'express';
import { rootHandler, sendHandler, recieveHandler } from './handlers';

const app = express();
const port = process.env.PORT || '8000';

app.get('/', rootHandler);
app.get('/send/', sendHandler);
app.get('/receive/', recieveHandler);

app.locals.pretty = true;

app.listen(port, err => {
  if (err) return console.error(err);
  return console.log(`@BBBNMS server is listening on ${port}`);
});