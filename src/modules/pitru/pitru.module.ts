import { Module } from '@nestjs/common';
import { PitruService } from './pitru.service';
import { PitruController } from './pitru.controller';

@Module({
  controllers: [PitruController],
  providers: [PitruService],
  exports: [PitruService],
})
export class PitruModule {}
