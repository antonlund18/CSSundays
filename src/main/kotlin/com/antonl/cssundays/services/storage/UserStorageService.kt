package com.antonl.cssundays.services.storage

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.services.storage.converters.RequestDTOConverter

class UserStorageService {
    companion object {
        private const val bucket = "cssundays-public-images";
        private const val folder = "users";

        suspend fun getPresignedUploadRequest(imageKey: String): RequestDTO {
            val httpRequest = S3StorageService.getPresignedUploadRequest(bucket, "$folder/$imageKey")
            return RequestDTOConverter.toRequestDTO(httpRequest);
        }

        suspend fun deleteImage(imageKey: String?) {
            S3StorageService.deleteObjectFromBucket(bucket, "$folder/$imageKey");
        }
    }
}