import { Module } from '@nestjs/common';
import { PandasController } from './pandas.controller.js';
import { PandasService } from './pandas.service.js';

@Module({
  controllers: [PandasController],
  providers: [PandasService],
  exports: [PandasService],
})
export class PandasModule {}
