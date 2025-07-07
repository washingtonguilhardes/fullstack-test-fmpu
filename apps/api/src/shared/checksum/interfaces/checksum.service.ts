export interface ChecksumService {
  /**
   * Calculates SHA256 checksum for the given buffer
   * @param buffer - The buffer to calculate checksum for
   * @returns string - The hexadecimal SHA256 checksum string
   */
  calculate(buffer: Buffer): string;
}

export const ChecksumServiceRef = Symbol('ChecksumService');
