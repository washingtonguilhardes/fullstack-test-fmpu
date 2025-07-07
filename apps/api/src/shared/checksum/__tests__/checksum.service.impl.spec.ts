import { ChecksumServiceImpl } from '../application/checksum.service.impl';

describe('ChecksumServiceImpl', () => {
  let checksumService: ChecksumServiceImpl;

  beforeEach(() => {
    checksumService = new ChecksumServiceImpl();
  });

  describe('calculate', () => {
    it('should calculate SHA256 checksum', async () => {
      const buffer = Buffer.from('Hello, World!');
      const result = await checksumService.calculate(buffer);

      // SHA256 of "Hello, World!" in hex
      const expected =
        'dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f';
      expect(result).toBe(expected);
    });

    it('should handle empty buffer', async () => {
      const buffer = Buffer.alloc(0);
      const result = await checksumService.calculate(buffer);

      // SHA256 of empty string
      const expected =
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      expect(result).toBe(expected);
    });

    it('should handle large buffer', async () => {
      const buffer = Buffer.alloc(1000, 'A');
      const result = await checksumService.calculate(buffer);

      expect(result).toHaveLength(64); // SHA256 hex string length
      expect(result).toMatch(/^[a-f0-9]+$/); // Valid hex string
    });
  });
});
