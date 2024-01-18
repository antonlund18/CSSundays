package com.antonl.cssundays.model.errors

interface HasErrors {
    fun getErrors(): List<Error>
    fun hasErrors(): Boolean
}