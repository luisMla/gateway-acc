import { Injectable } from '@nestjs/common';
import { CustomHttpService } from '../shared/http.service';
import { CreateSubscriptionPayload } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private http: CustomHttpService) {}

  async createSubscription(payload: CreateSubscriptionPayload) {
    return await this.http.post('/subscription/subscription', {}, payload);
  }

  async revokeSubscription(id: string) {
    return await this.http.put(`/subscription/subscription/${id}`, {});
  }

  async getById(id: string, request: Request) {
    const options = this.http.forwadHeaders(request);
    return await this.http.get(`/subscription-private/${id}`, {}, options);
  }

  async getAll(limit: number, offset: number, request: Request) {
    const options = this.http.forwadHeaders(request);
    return await this.http.get(
      '/subscription-private',
      { limit, offset },

      options,
    );
  }

  async sendNewsLetter(id: string, request: Request) {
    const options = this.http.forwadHeaders(request);
    return await this.http.post(
      `/subscription-private/send-emails/${id}`,
      {},
      {},
      options,
    );
  }
}
