import { describe, it, expect, beforeEach } from '@jest/globals';
import { Artifactory } from '../artifactory.entity';
import {
  ArtifactoryType,
  ArtifactoryEntity,
  UpdateArtifactoryDto,
} from '@driveapp/contracts/entities/artifactory/artifactory.entity';

describe('Artifactory Domain Entity', () => {
  let baseData: ArtifactoryEntity;
  let artifactory: Artifactory;

  beforeEach(() => {
    baseData = {
      _id: 'id1',
      name: 'Test File',
      type: ArtifactoryType.FILE,
      user_id: 'user1',
      parent_id: 'parent1',
      path: '/test/file',
      server_name: 'server1',
      mime_type: 'text/plain',
      size: 1234,
      access_url: 'http://url',
      access_url_expires_at: new Date(Date.now() + 10000),
      storage_path: '/storage/path',
      storage_provider: 'local',
      checksum: 'abc123',
      is_public: false,
      upload_date: new Date('2023-01-01T00:00:00Z'),
      last_accessed_at: new Date('2023-01-02T00:00:00Z'),
      created_at: new Date('2023-01-01T00:00:00Z'),
      updated_at: new Date('2023-01-02T00:00:00Z'),
    };
    artifactory = new Artifactory({ ...baseData });
  });

  it('should construct with all properties', () => {
    expect(artifactory._id).toBe(baseData._id);
    expect(artifactory.name).toBe(baseData.name);
    expect(artifactory.type).toBe(baseData.type);
    expect(artifactory.user_id).toBe(baseData.user_id);
    expect(artifactory.parent_id).toBe(baseData.parent_id);
    expect(artifactory.path).toBe(baseData.path);
    expect(artifactory.server_name).toBe(baseData.server_name);
    expect(artifactory.mime_type).toBe(baseData.mime_type);
    expect(artifactory.size).toBe(baseData.size);
    expect(artifactory.access_url).toBe(baseData.access_url);
    expect(artifactory.access_url_expires_at).toEqual(
      baseData.access_url_expires_at,
    );
    expect(artifactory.storage_path).toBe(baseData.storage_path);
    expect(artifactory.storage_provider).toBe(baseData.storage_provider);
    expect(artifactory.checksum).toBe(baseData.checksum);
    expect(artifactory.is_public).toBe(baseData.is_public);
    expect(artifactory.upload_date).toEqual(baseData.upload_date);
    expect(artifactory.last_accessed_at).toEqual(baseData.last_accessed_at);
    expect(artifactory.created_at).toEqual(baseData.created_at);
    expect(artifactory.updated_at).toEqual(baseData.updated_at);
  });

  it('should update info', () => {
    const update: UpdateArtifactoryDto = {
      name: 'Updated Name',
      parent_id: 'newParent',
      path: '/new/path',
      is_public: true,
      access_url: 'http://newurl',
      access_url_expires_at: new Date(Date.now() + 20000),
    };
    artifactory.updateInfo(update);
    expect(artifactory.name).toBe(update.name);
    expect(artifactory.parent_id).toBe(update.parent_id);
    expect(artifactory.path).toBe(update.path);
    expect(artifactory.is_public).toBe(update.is_public);
    expect(artifactory.access_url).toBe(update.access_url);
    expect(artifactory.access_url_expires_at).toEqual(
      update.access_url_expires_at,
    );
  });

  it('should update access url and expiration', () => {
    const url = 'http://newaccessurl';
    const expires = new Date(Date.now() + 30000);
    artifactory.updateAccessUrl(url, expires);
    expect(artifactory.access_url).toBe(url);
    expect(artifactory.access_url_expires_at).toEqual(expires);
  });

  it('should record access', () => {
    const before = artifactory.last_accessed_at;
    artifactory.recordAccess();
    expect(artifactory.last_accessed_at.getTime()).toBeGreaterThan(
      before.getTime(),
    );
    expect(artifactory.updated_at.getTime()).toBeGreaterThan(before.getTime());
  });

  it('should make public', () => {
    artifactory.makePublic();
    expect(artifactory.is_public).toBe(true);
  });

  it('should make private', () => {
    artifactory.makePrivate();
    expect(artifactory.is_public).toBe(false);
  });

  it('should update size', () => {
    artifactory.updateSize(9999);
    expect(artifactory.size).toBe(9999);
  });

  it('should update checksum', () => {
    artifactory.updateChecksum('newchecksum');
    expect(artifactory.checksum).toBe('newchecksum');
  });

  it('should check if is file', () => {
    expect(artifactory.isFile()).toBe(true);
    artifactory.type = ArtifactoryType.FOLDER;
    expect(artifactory.isFile()).toBe(false);
  });

  it('should check if is folder', () => {
    artifactory.type = ArtifactoryType.FOLDER;
    expect(artifactory.isFolder()).toBe(true);
    artifactory.type = ArtifactoryType.FILE;
    expect(artifactory.isFolder()).toBe(false);
  });

  it('should check if access url is expired', () => {
    artifactory.access_url_expires_at = new Date(Date.now() - 10000);
    expect(artifactory.isAccessUrlExpired()).toBe(true);
    artifactory.access_url_expires_at = new Date(Date.now() + 10000);
    expect(artifactory.isAccessUrlExpired()).toBe(false);
    artifactory.access_url_expires_at = undefined;
    expect(artifactory.isAccessUrlExpired()).toBe(false);
  });

  it('should convert to entity', () => {
    const entity = artifactory.toEntity();
    expect(entity).toEqual({ ...baseData, ...entity });
  });
});
