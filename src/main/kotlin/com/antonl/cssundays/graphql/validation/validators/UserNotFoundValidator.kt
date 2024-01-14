package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class UserNotFoundValidator : Validator() {
    @Autowired
    private lateinit var userService: UserService;

    override fun hasError(input: UserMutationInput): Boolean {
        input.id?.let { userService.findUserById(it) } ?: return true
        return true
    }

    override fun getError(): Error {
        return Error.USER_NOT_FOUND
    }
}