import { Module } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [SpotsService],
  exports: [SpotsService],
})
export class SpotsModule {}
