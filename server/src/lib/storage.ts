import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, normalize, resolve } from "node:path";
import { env } from "../env.js";
import { fail } from "./errors.js";

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const s3 =
  env.S3_ENDPOINT && env.S3_BUCKET && env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
    ? new S3Client({
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
      })
    : null;

const uploadRoot = resolve(env.UPLOAD_DIR);

/** Stores an uploaded image (R2/S3 in production, local disk otherwise) and returns its path. */
export async function storeImage(folder: "avatars" | "teams" | "tournaments", ownerId: string | number, file: File) {
  const extension = extensions[file.type];
  if (!extension || file.size > MAX_IMAGE_BYTES) fail("INVALID_IMAGE");

  const path = `${folder}/${ownerId}/${randomUUID()}.${extension}`;
  const body = new Uint8Array(await file.arrayBuffer());

  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: path,
        Body: body,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } else {
    const target = join(uploadRoot, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, body);
  }
  return path;
}

export async function deleteImage(path: string | null | undefined): Promise<void> {
  if (!path) return;
  try {
    if (s3) await s3.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: path }));
    else await rm(join(uploadRoot, path), { force: true });
  } catch (error) {
    console.warn("Could not delete image", path, error);
  }
}

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (s3 && env.IMAGE_BASE_URL) return `${env.IMAGE_BASE_URL.replace(/\/$/, "")}/${path}`;
  const base = env.PUBLIC_API_URL ?? `http://localhost:${env.PORT}`;
  return `${base.replace(/\/$/, "")}/uploads/${path}`;
}

/** Serves locally stored images (development only). */
export async function readLocalImage(requestPath: string): Promise<{ body: Buffer; type: string } | null> {
  const relative = normalize(decodeURIComponent(requestPath)).replace(/^([/\\])+/, "");
  const target = resolve(uploadRoot, relative);
  if (!target.startsWith(uploadRoot)) return null;
  const extension = target.split(".").pop() ?? "";
  const type = Object.entries(extensions).find(([, ext]) => ext === extension)?.[0];
  if (!type) return null;
  try {
    return { body: await readFile(target), type };
  } catch {
    return null;
  }
}
