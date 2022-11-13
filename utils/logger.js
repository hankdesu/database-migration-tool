import { createLogger, format, transports } from 'winston';

const { Console } = transports;
const { simple } = format;

const logger = createLogger({
  // format: format.json(),
  transports: [
    // new File({
    //   filename: 'error.log',
    //   level: 'error',
    //   format: combine(json(), timestamp()),
    // }),
    // new File({
    //   level: 'info',
    //   filename: 'info.log',
    //   format: combine(colorize(), simple()),
    // }),
    new Console({ format: simple() }),
  ],
});

export default logger;
