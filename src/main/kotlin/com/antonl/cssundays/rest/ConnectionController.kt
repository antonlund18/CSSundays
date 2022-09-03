package com.antonl.cssundays.rest

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ConnectionController {

    /*
        DO NOT DELETE
        Used by AWS to perform health check
     */
    @GetMapping("/api/connection-test")
    fun connectionTest(): ResponseEntity<Int> {
        return ResponseEntity.ok().build();
    }
}