import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { XApiKeyGuard } from '../auth/x-api-key-guard';
import { SubscriptionService } from './subscription.service';

@ApiHeader({
  name: 'x-api-key',
  description: 'Custom header',
})
@Controller('api/subscription-private')
@ApiTags('subscription-private')
export class SubscriptionPrivateController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiOperation({
    description: 'Return pagination of Subscriptions for all newsletter',
  })
  async getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Request() request,
  ): Promise<any> {
    return await this.subscriptionService.getAll(limit, offset, request);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiOperation({
    description: 'Return detail Subscription for a newsletter',
  })
  async getById(@Param('id') id: string, @Request() request): Promise<any> {
    return await this.subscriptionService.getById(id, request);
  }

  @Post('/send-emails/:newsLetterId')
  @ApiBearerAuth()
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiOperation({
    description: 'Return detail Subscription for a newsletter',
  })
  async sendNewsLetter(
    @Param('newsLetterId') newsLetterId: string,
    @Request() request,
  ): Promise<any> {
    return await this.subscriptionService.sendNewsLetter(newsLetterId, request);
  }
}
