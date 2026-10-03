import { Module } from '@nestjs/common';
import { PandasModule } from '../pandas/pandas.module.js';
import { VendorsService } from './vendors.service.js';
import { VendorsController } from './vendors.controller.js';

@Module({
  imports: [PandasModule],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
