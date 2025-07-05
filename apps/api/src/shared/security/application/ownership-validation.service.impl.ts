import { ApplicationException } from '@/shared';
import { OwnershipValidationService } from '@/shared/security/interfaces/ownership-validation.service';

import { Resource } from '../domain/resource';

export class OwnershipValidationServiceImpl
  implements OwnershipValidationService
{
  //TODO: mayber I should not have a promise here ;)
  async execute(target: Resource, source: string): Promise<void> {
    if (!target.isSourceAllowed(source)) {
      throw ApplicationException.forbiddenResource();
    }
  }
}
