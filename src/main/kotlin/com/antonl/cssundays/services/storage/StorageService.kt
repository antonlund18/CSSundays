package com.antonl.cssundays.services.storage

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.services.storage.converters.RequestDTOConverter
import com.antonl.cssundays.util.StorageConstants


abstract class StorageService(val folderPath: String, val bucketName: String = StorageConstants.BUCKET_NAME) {
    suspend fun getPresignedUploadRequest(imageKey: String): RequestDTO {
        val httpRequest = S3StorageService.getPresignedUploadRequest(bucketName, "${folderPath}/$imageKey")
        return RequestDTOConverter.toRequestDTO(httpRequest);
    }

    suspend fun deleteImage(imageKey: String?) {
        S3StorageService.deleteObjectFromBucket(bucketName, "${folderPath}/$imageKey");
    }
}