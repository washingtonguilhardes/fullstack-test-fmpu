import { PathFactory } from '../path';

describe('PathFactory', () => {
  describe('sanitizeName', () => {
    it('should preserve file extensions when sanitizing names', () => {
      // Test with various file extensions
      expect(PathFactory.fromName('invoice.pdf').getValue()).toBe(
        'invoice.pdf',
      );
      expect(PathFactory.fromName('document.docx').getValue()).toBe(
        'document.docx',
      );
      expect(PathFactory.fromName('image.jpg').getValue()).toBe('image.jpg');
      expect(PathFactory.fromName('file with spaces.txt').getValue()).toBe(
        'file-with-spaces.txt',
      );
      expect(PathFactory.fromName('UPPERCASE.PDF').getValue()).toBe(
        'uppercase.pdf',
      );
    });

    it('should handle names without extensions', () => {
      expect(PathFactory.fromName('folder name').getValue()).toBe(
        'folder-name',
      );
      expect(PathFactory.fromName('UPPERCASE FOLDER').getValue()).toBe(
        'uppercase-folder',
      );
      expect(PathFactory.fromName('folder_with_underscores').getValue()).toBe(
        'folder-with-underscores',
      );
    });

    it('should handle edge cases', () => {
      // Name starting with dot (hidden file) - slugify removes leading dots
      expect(PathFactory.fromName('.hidden').getValue()).toBe('hidden');

      // Name ending with dot - slugify removes trailing dots
      expect(PathFactory.fromName('file.').getValue()).toBe('file');

      // Multiple dots in name
      expect(PathFactory.fromName('file.backup.pdf').getValue()).toBe(
        'file-backup.pdf',
      );

      // Special characters
      expect(PathFactory.fromName('file@#$%^&*().pdf').getValue()).toBe(
        'file.pdf',
      );
    });

    it('should handle path traversal attempts', () => {
      expect(PathFactory.fromName('../malicious').getValue()).toBe('malicious');
      expect(PathFactory.fromName('file../.pdf').getValue()).toBe('file.pdf');
    });
  });
});
