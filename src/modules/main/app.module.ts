import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth';
import { CommonModule } from 'modules/common';
import { ConfigModule } from 'modules/config';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    CommonModule,
    SubscriptionModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
