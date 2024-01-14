package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

enum class ErrorTypes(val errorCode: Int) : ErrorClassification {
    USER_NOT_FOUND(101),
    INCORRECT_PASSWORD(102),
    INVALID_PASSWORD(103),
    PASSWORDS_NOT_MATCHING(104),
    INVALID_EMAIL(105),
    EMAIL_IN_USE(106),
    INVALID_PLAYERTAG(107),
    PLAYERTAG_IN_USE(108),
    INTERNAL_ERROR(503)
}