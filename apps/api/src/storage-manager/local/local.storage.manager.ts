import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { createReadStream, promises as fs } from "fs";
import { dirname, join, normalize } from "path";
import { BaseStorageManager } from "@api/storage-manager/storage-manager.base";
import {
  LocalFileMetadata,
  LocalUploadResult,
} from "@api/storage-manager/storage-manager.constant";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalStorageManager extends BaseStorageManager<
  LocalFileMetadata,
  NodeJS.ReadableStream,
  LocalUploadResult
> {
  private readonly baseDir: string;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    super();
    this.baseDir = this.config.get<string>("STORAGE_PATH") || "storage";
  }

  createUploadUrl(key: string) {
    return Promise.resolve(
      `${this.config.get<string>("API_HOST")}:${this.config.get<number>("API_PORT")}/files/upload/${key}`,
    );
  }

  getDownloadUrl(key: string) {
    return Promise.resolve(
      `${this.config.get<string>("API_HOST")}:${this.config.get<number>("API_PORT")}/files/download/${key}`,
    );
  }

  async deleteFile(key: string): Promise<void> {
    const path = this.resolvePath(key);

    try {
      await fs.unlink(path);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        throw err;
      }
    }
  }

  async directUpload(
    key: string,
    body: Buffer,
    _contentType: string,
  ): Promise<LocalUploadResult> {
    const path = this.resolvePath(key);

    await fs.mkdir(dirname(path), { recursive: true });
    await fs.writeFile(path, body);

    return {
      path,
      size: body.length,
    };
  }

  async directDownload(key: string): Promise<NodeJS.ReadableStream> {
    const path = this.resolvePath(key);

    try {
      await fs.access(path);
      return createReadStream(path);
    } catch {
      throw new NotFoundException("File not found");
    }
  }

  async getFileMetadata(key: string): Promise<LocalFileMetadata> {
    const path = this.resolvePath(key);
    try {
      const stats = await fs.stat(path);

      return {
        size: stats.size,
        lastModified: stats.mtime,
        path,
      };
    } catch (err) {
      console.log(err);
      throw new NotFoundException("File not found");
    }
  }

  private resolvePath(key: string): string {
    const safePath = normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
    return join(this.baseDir, safePath);
  }
}

export type LocalStorageManagerType = BaseStorageManager<
  LocalFileMetadata,
  NodeJS.ReadableStream,
  LocalUploadResult
>;
