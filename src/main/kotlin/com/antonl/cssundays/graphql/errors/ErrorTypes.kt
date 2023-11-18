package com.antonl.cssundays.graphql.errors

import graphql.ErrorClassification

enum class ErrorTypes(val errorCode: Int) : ErrorClassification {
    USER_NOT_FOUND(101),
    INCORRECT_PASSWORD(102),
    INVALID_PASSWORD(103),
    PASSWORDS_NOT_MATCHING(104),
}