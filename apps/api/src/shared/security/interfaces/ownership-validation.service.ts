import { Resource } from '@/shared/security/domain/resource';

export interface OwnershipValidationService {
  execute(target: Resource, source: string): Promise<void>;
}

export const OwnershipValidationServiceRef = Symbol(
  'OwnershipValidationService',
);
