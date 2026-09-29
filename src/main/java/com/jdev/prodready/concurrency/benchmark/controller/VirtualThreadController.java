package com.jdev.prodready.concurrency.benchmark.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class VirtualThreadController {
    private static final Logger log = LoggerFactory.getLogger(VirtualThreadController.class);

    @GetMapping("/virtual-io")
    public String simulateWork() throws InterruptedException {
        // Simulating 100ms downstream I/O latency (e.g., PostgreSQL query or microservice call)
        // Thread.sleep on a Virtual Thread unmounts the virtual thread from the carrier OS thread.
        Thread.sleep(200);

        return "Processed on: " + Thread.currentThread().toString();
    }
}
