export enum UrlTargetObjectType {
  ARTIST = 'ARTIST',
  USER = 'USER',
  SALE_ITEM = 'SALE_ITEM',
  GENRE = 'GENRE',
  BADGE = 'BADGE',
  HISTORY = 'HISTORY',
  MEDIA = 'MEDIA',
  URL = 'URL',
  GENERAL = 'GENERAL',
  UNKNOWN = 'UNKNOWN',
  VOCAL = 'VOCAL',
}

export enum MediaCategory {
  AUDIO,
  IMAGE,
  VIDEO,
  UNKNOWN,
}

export enum AuthSourceProvider {
  EMAIL,
  GOOGLE,
  APPLE,
}

export enum HistoryKind {
  CREATE,
  DELETE,
  UPDATE,
  UNKNOWN,
}

export enum Target {
  VOCAL,
  ARTIST,
  GENERAL,
  UNKNOWN,
}

export enum AvailableFundingOptions {
  WALLET_CREDIT,
  FUNDING,
}

export enum DriveappBaseProfileRole {
  CUSTOMER,
  CREATOR,
  CREATOR_ADMIN,
  ADMIN,
}

export enum ArtistMediaCategory {
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  COVER_PICTURE = 'COVER_PICTURE',
}

export enum ArtistSaleItemType {
  REQUIRED = 'REQUIRED',
  UPGRADE_OPTION = 'UPGRADE_OPTION',
}

export enum VocalMediaCategory {
  THUMBNAIL = 'THUMBNAIL',
  COVER = 'COVER',
  DEMO = 'DEMO',
}
