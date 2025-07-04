import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'public-resource';
export const PublicResource = () => SetMetadata(IS_PUBLIC_KEY, true);
