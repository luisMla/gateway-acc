import { createLogger, format, transports } from 'winston';
const logger = createLogger({
  level: 'debug', // todo set different levels for production
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
