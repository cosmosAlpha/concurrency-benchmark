import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        high_concurrency_ramp: {
            executor: 'ramping-arrival-rate',
            startRate: 1000,
            timeUnit: '1s',
            preAllocatedVUs: 10000,
            maxVUs: 30000,
            stages: [
                { duration: '10s', target: 5000 },  // Ramp to 5,000 req/sec
                { duration: '30s', target: 10000 }, // Ramp to 10,000 req/sec (Sustaining 100k total connections over window)
                { duration: '10s', target: 0 },
            ],
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'], // Require <1% failure rate
        http_req_duration: ['p(95)<250'], // 95% of requests must complete under 250ms
    },
};

export default function () {
    // Toggle endpoint URL between 8081 (Virtual Threads) and 8082 (WebFlux)
    const url = __ENV.TARGET_URL || 'http://host.docker.internal:8081/api/v1/reactive-io';
    //const url = __ENV.TARGET_URL || 'http://host.docker.internal:8081/api/v1/virtual-io';

    const params = {
        headers: {
            'Connection': 'keep-alive',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}