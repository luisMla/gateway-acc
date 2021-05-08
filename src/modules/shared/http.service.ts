import {
  BadRequestException,
  ForbiddenException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as qs from 'qs';
import logger from '../../utils/loger';
import { ConfigService } from '../config';

const errorsMap = {
  400: BadRequestException,
  403: ForbiddenException,
  404: NotFoundException,
  500: InternalServerErrorException,
};
const titlesFullList = {
  GET: [
    {
      // example for map errors
      endpoint: '/auth/me',
      title: 'failed fetching me information',
    },
  ],
  PUT: [
    {
      endpoint: '/subscription/subscription/',
      title: 'failed revoke subscription, try again later',
    },
  ],
  DELETE: [],
  POST: [],
};
// '__number__' is for endpoints like foo/1/fooParam/12 -> foo/__number__/fooParam/__number__ will be detected for custom messages
const getTitle = (method: string, endpoint: string) => {
  const parsedEndpoint = endpoint.replace(/\d+/g, '__number__');
  const error = titlesFullList[method].find(
    (req) => req.endpoint === parsedEndpoint,
  );
  const title = error?.title || 'here is an error';

  return title;
};

@Injectable()
export class CustomHttpService {
  apiKey;
  conf: ConfigService = new ConfigService('.env');
  private defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '123456', // This apikey mus be in a secrets file
    },
  };

  constructor(private readonly http: HttpService) {
    this.loadDefaultOptions();
  }

  private loadDefaultOptions() {
    this.apiKey = this.conf.get('X-API-KEY');
    console.log('this.apiKey: ', this.apiKey);
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
    };
  }
  private baseUrl = 'http://subscriptions:3000/api';

  private wrappedError(error, path, method) {
    let errorStatus = error?.response?.status ?? 500;

    let originalMessage = '';
    if (this.isValidError(error)) {
      const { response } = error;

      const errorText = JSON.stringify(response.data);

      errorStatus = response.status;
      originalMessage = `'${errorText}'`;
    }

    const ProcessedError =
      errorsMap[errorStatus] || InternalServerErrorException;

    return new ProcessedError(getTitle(method, path), originalMessage);
  }

  private isValidError(error) {
    return (
      error && error.response && error.response.status && error.response.data
    );
  }

  private buildUrlWithQueryParams(endpointPath: string, queryParams) {
    const queryParamsString = qs.stringify(queryParams);
    return `${endpointPath}${
      queryParamsString.length === 0 ? '' : `?${queryParamsString}`
    }`;
  }

  async get<T>(path: string, queryParams?, configOptions?): Promise<T> {
    try {
      const url = this.buildUrlWithQueryParams(
        `${this.baseUrl}${path}`,
        queryParams,
      );

      const options = configOptions ? configOptions : this.defaultOptions;

      const { data } = await this.http.get(url, options).toPromise();

      return data as T;
    } catch (error) {
      logger.error(
        `GET ONE | ${path} | PARAMS | ${JSON.stringify(queryParams)}`,
      );
      throw this.wrappedError(error, path, 'GET');
    }
  }

  async post<T>(
    path: string,
    queryParams,
    body = {},
    configOptions = this.defaultOptions,
  ) {
    try {
      const url: string = this.buildUrlWithQueryParams(
        `${this.baseUrl}${path}`,
        queryParams,
      );
      const { data } = await this.http
        .post(url, body, {
          ...configOptions,
        })
        .toPromise();

      return data as T;
    } catch (error) {
      logger.error(
        `POST | ${path} | PARAMS ${JSON.stringify(
          queryParams,
        )} | BODY | ${JSON.stringify(body)}`,
      );
      throw this.wrappedError(error, path, 'POST');
    }
  }

  async put<T>(
    path: string,
    queryParams,
    body = {},
    configOptions = this.defaultOptions,
  ) {
    try {
      const url = `${this.baseUrl}${path}`;
      const { data } = await this.http
        .put(url, body, {
          params: queryParams,
          ...configOptions,
        })
        .toPromise();

      return data as T;
    } catch (error) {
      logger.error(
        `PUT | ${path} | PARAMS ${JSON.stringify(
          queryParams,
        )} | BODY | ${JSON.stringify(body)}`,
      );
      throw this.wrappedError(error, path, 'PUT');
    }
  }

  async delete(path: string, queryParams, configOptions = this.defaultOptions) {
    try {
      const url = `${this.baseUrl}${path}`;
      const { data } = await this.http
        .delete(url, {
          params: queryParams,
          ...configOptions,
        })
        .toPromise();

      return data;
    } catch (error) {
      logger.error(`DELETE | ${path} | PARAMS ${JSON.stringify(queryParams)}`);
      throw this.wrappedError(error, path, 'DELETE');
    }
  }

  forwadHeaders(request: Request) {
    const { headers } = request;
    return {
      headers: { ...headers, ...this.defaultOptions.headers },
    };
  }
}
