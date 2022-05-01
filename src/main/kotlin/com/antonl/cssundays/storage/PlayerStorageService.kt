package com.antonl.cssundays.storage

import java.util.UUID

class PlayerStorageService {
    companion object {
        private const val bucket = "cssundays-public-pictures";
        private const val folder = "players";

        suspend fun uploadImage(imagePath: String): String {
            val id = UUID.randomUUID().toString() + ".jpg";
            S3StorageService.uploadObjectToBucket(bucket, "$folder/$id", imagePath);
            return id;
        }

        suspend fun deleteImage(imageKey: String) {
            S3StorageService.deleteObjectFromBucket(bucket, "$folder/$imageKey");
        }
    }
}