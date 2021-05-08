import { HttpModule, Module } from '@nestjs/common';
import { CustomHttpService } from './http.service';

@Module({
  imports: [HttpModule],
  exports: [HttpModule, CustomHttpService],
  providers: [CustomHttpService],
})
export class SharedModule {}
