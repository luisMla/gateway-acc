import logger from './loger';

const parseHttpError = (error) => {
  const {
    response: { data = {}, status = 500 },
  } = error;
  const errorText = JSON.stringify(data);
  return `Error - ${status} - original message ${errorText}`;
};

const parseDbError = (_error) => {
  // todo: Implement depends on your DB
  return `Error - error from db - `;
};

const customErrorLogger = (service: string) => (
  exception: string,
  fromDb = false,
) => {
  const message = !fromDb ? parseHttpError(exception) : parseDbError(exception);
  logger.error(`${new Date().toISOString()} - ${service} - ${message}`);
};
export default customErrorLogger;
