import { Injectable } from '@nestjs/common';
import { CustomHttpService } from '../shared/http.service';
import { LoginPayload } from './login.payload';

@Injectable()
export class AuthService {
  constructor(private http: CustomHttpService) {}

  async login(payload: LoginPayload): Promise<any> {
    return await this.http.post('/auth/login', {}, payload);
  }

  async register(payload: LoginPayload): Promise<any> {
    return await this.http.post('/auth/register', {}, payload);
  }

  async getLoggedInUser(request: Request): Promise<any> {
    const options = this.http.forwadHeaders(request);

    return await this.http.get('/auth/me', {}, options);
  }
}
