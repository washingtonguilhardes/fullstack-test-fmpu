import { SetMetadata } from '@nestjs/common';
enum BaseRoles {
  USER = 'USER',
}
export const ROLES_KEY = 'roles';
export const RequiredRoles = (...roles: BaseRoles[]) =>
  SetMetadata(ROLES_KEY, roles);
