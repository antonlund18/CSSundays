package com.antonl.cssundays.services.storage

import aws.sdk.kotlin.services.s3.S3Client
import aws.sdk.kotlin.services.s3.model.DeleteObjectRequest
import aws.sdk.kotlin.services.s3.model.PutObjectRequest
import aws.smithy.kotlin.runtime.content.asByteStream
import java.nio.file.Paths

suspend fun main(args: Array<String>) {
    S3StorageService.uploadObjectToBucket(
        "cssundays-public-pictures",
        "ged.jpg",
        "C:\\Users\\anton\\Documents\\ged.jpg"
    )
}


class S3StorageService {
    companion object {
        private const val OWNER_CANONICAL_ID = "aaed284ac1338dd62f43e348d9a8a96c553384434e887883026b090d10b1801f";
        private const val ALL_USERS_GROUP = "http://acs.amazonaws.com/groups/global/AllUsers";

        @Throws(Exception::class)
        suspend fun uploadObjectToBucket(bucketName: String, objectKey: String, objectPath: String) {
            val request = PutObjectRequest {
                bucket = bucketName
                key = objectKey
                this.body = Paths.get(objectPath).asByteStream()
                grantFullControl= "id=$OWNER_CANONICAL_ID"
                grantRead = "uri=$ALL_USERS_GROUP"
            }

            S3Client { region = "us-east-1" }.use { s3 ->
                val response = s3.putObject(request)
                println("Tag information is ${response.eTag}")
            }
        }

        @Throws(Exception::class)
        suspend fun deleteObjectFromBucket(bucketName: String, objectKey: String) {
            val request = DeleteObjectRequest {
                bucket = bucketName
                key = objectKey
            }

            S3Client { region = "us-east-1" }.use { s3 ->
                val response = s3.deleteObject(request);
                println("$objectKey was deleted from $bucketName")
            }
        }
    }
}