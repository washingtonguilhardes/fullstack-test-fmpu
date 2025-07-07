import { Config } from 'jest';

import { config } from '@driveapp/jest-config/nest';

export default {
  ...config,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['../jest.setup.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    'index.ts',
    '.*\\.module\\.ts$',
    '.*\\.spec\\.ts$',
    '.*\\.schema\\.ts$',
  ],
} as Config;
