import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        constant_5k_load: {
            executor: 'constant-vus',
            vus: 1000,             // Sized for 200ms endpoint delay (1000 VUs * 5 req/s = 5000 RPS)
            duration: '2m',
        },
    },
    noConnectionReuse: false,   // Force connection pooling (HTTP Keep-Alive)
    discardResponseBodies: true,// Reduces k6 memory consumption
};

export default function () {
    // spring active profile any other than 'mvc'
    // const url = __ENV.TARGET_URL || 'http://host.docker.internal:8081/api/v1/reactive-io';
    // spring active profile - 'mvc'
    const url = __ENV.TARGET_URL || 'http://host.docker.internal:8081/api/v1/virtual-io';

    const res = http.get(url, { headers: { 'Connection': 'keep-alive' } ,
        timeout: '5s',
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'latency under 250ms': (r) => r.timings.duration < 250,
    });
}