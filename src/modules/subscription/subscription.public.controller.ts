import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { XApiKeyGuard } from '../auth/x-api-key-guard';
import { CreateSubscriptionPayload } from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@ApiHeader({
  name: 'x-api-key',
  description: 'Custom header',
})
@Controller('api/subscription')
@ApiTags('subscription')
export class SubscriptionPublicController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscription')
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 201, description: 'Successful Subscription' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({
    description: 'Create Subscription for a newsletter',
  })
  async createSubscription(
    @Body() payload: CreateSubscriptionPayload,
  ): Promise<any> {
    return await this.subscriptionService.createSubscription(payload);
  }

  @Put('subscription/:id')
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 201, description: 'Revoked Subscription' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({
    description: 'Cancel Subscription for a newsletter',
  })
  async revokeSubscription(@Param('id') id: string): Promise<any> {
    return await this.subscriptionService.revokeSubscription(id);
  }
}
