import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from './../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule],
    }).compile();
  });

  describe('root', () => {
    it('should return "http://localhost/alive"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.alive()).toBe('alive');
    });
  });
});
