import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, LoginPayload, RegisterPayload } from './';
import { XApiKeyGuard } from './x-api-key-guard';

@ApiHeader({
  name: 'x-api-key',
  description: 'Custom header',
})
@Controller('api/auth')
@ApiTags('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginPayload): Promise<any> {
    return await this.authService.login(payload);
  }

  @Post('register')
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterPayload): Promise<any> {
    return await this.authService.register(payload);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(XApiKeyGuard)
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request): Promise<any> {
    return await this.authService.getLoggedInUser(request);
  }
}
