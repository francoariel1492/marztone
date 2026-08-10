export interface StoredFile {
  url: string;
  storageKey: string;
  width?: number;
  height?: number;
}

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export abstract class StorageService {
  abstract upload(input: UploadInput): Promise<StoredFile>;
  abstract remove(storageKey: string): Promise<void>;
}
