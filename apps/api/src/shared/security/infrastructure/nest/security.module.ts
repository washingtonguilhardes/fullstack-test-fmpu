import { Module } from '@nestjs/common';

import { OwnershipValidationServiceImpl } from '../../application/ownership-validation.service.impl';
import { OwnershipValidationServiceRef } from '../../interfaces/ownership-validation.service';

@Module({
  imports: [],
  providers: [
    {
      provide: OwnershipValidationServiceRef,
      useClass: OwnershipValidationServiceImpl,
    },
  ],
  exports: [OwnershipValidationServiceRef],
})
export class SecurityModule {}
