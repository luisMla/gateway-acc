import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionPrivateController } from './subscription.private.controller';
import { SubscriptionPublicController } from './subscription.public.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [SharedModule],
  exports: [SubscriptionService],
  providers: [SubscriptionService],
  controllers: [SubscriptionPublicController, SubscriptionPrivateController],
})
export class SubscriptionModule {}
