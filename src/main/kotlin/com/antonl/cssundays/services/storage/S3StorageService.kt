package com.antonl.cssundays.services.storage

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.sdk.kotlin.services.s3.presign
import aws.smithy.kotlin.runtime.http.request.HttpRequest
import com.antonl.cssundays.graphql.dto.ObjectType
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class S3StorageService {
    companion object {

        @Throws(Exception::class)
        suspend fun getPresignedUploadRequest(bucketName: String, objectKey: String): HttpRequest {
            return PutObjectRequest {
                bucket = bucketName
                key = objectKey
            }.presign(S3Client { region = "us-east-1" }.config, 3600L)
        }

        @Throws(Exception::class)
        suspend fun deleteObjectFromBucket(bucketName: String, objectKey: String) {
            val request = DeleteObjectRequest {
                bucket = bucketName
                key = objectKey
            }

            S3Client { region = "us-east-1" }.use { s3 ->
                s3.deleteObject(request);
            }
        }
    }
}