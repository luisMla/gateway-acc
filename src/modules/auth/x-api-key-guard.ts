import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '../config';

@Injectable()
export class XApiKeyGuard implements CanActivate {
  conf: ConfigService = new ConfigService('.env');
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const API_KEY = this.conf.get('X-API-KEY');

    const request = context.switchToHttp().getRequest();
    const {
      headers: { 'x-api-key': xApiKey = null },
    } = request;

    return xApiKey && xApiKey === API_KEY;
  }
}
