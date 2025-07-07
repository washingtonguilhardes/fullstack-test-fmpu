import { createHash } from 'crypto';

import { ChecksumService } from '../interfaces/checksum.service';

export class ChecksumServiceImpl implements ChecksumService {
  /**
   * Calculates SHA256 checksum for the given buffer
   * @param buffer - The buffer to calculate checksum for
   * @returns Promise<string> - The hexadecimal SHA256 checksum string
   */
  calculate(buffer: Buffer): string {
    try {
      const hash = createHash('sha256');
      hash.update(buffer);
      return hash.digest('hex');
    } catch (error) {
      throw new Error(
        `Failed to calculate SHA256 checksum: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
