package com.jdev.prodready.concurrency.benchmark.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1")
public class ReactiveController {

    @GetMapping("/reactive-io")
    public Mono<String> simulateWork() {
        // Non-blocking delay of 100ms using Reactor timers
        return Mono.delay(Duration.ofMillis(100))
                .map(i -> "Processed on: " + Thread.currentThread().toString());
    }
}
