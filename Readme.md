# Local Performance Testing Stack: k6 + Prometheus + Grafana

This repository contains a simple configuration to run a local performance monitoring stack using **k6**, **Prometheus**, and **Grafana**. Testing metrics are streamed in real time via Prometheus Remote Write.

## 🚀 Getting Started

### 1. Setup Configuration Files

Create a clean directory on your machine and place the following three files inside it:

#### `docker-compose.yml`
```yaml
version: '3.8'
networks:
  k6:

services:
  prometheus:
    image: prom/prometheus:latest
    command:
      - --web.enable-remote-write-receiver
      - --enable-feature=native-histograms
      - --config.file=/etc/prometheus/prometheus.yml
    networks:
      - k6
    ports:
      - "9090:9090"
    volumes:
      - ./prom/prometheus.yml:/etc/prometheus/prometheus.yml
  grafana:
    image: grafana/grafana:latest
    networks:
      - k6
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_BASIC_ENABLED=false
    volumes:
      - ./grafana/grafana-ds.yml:/etc/grafana/provisioning/datasources/datasources.yml
  k6:
    image: grafana/k6:latest
    networks:
      - k6
    volumes:
      - ./k6-scripts:/scripts
    environment:
      - K6_PROMETHEUS_RW_SERVER_URL=http://prometheus:9090/api/v1/write
      - K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),min,max
      - K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true
    command: run  -o experimental-prometheus-rw /scripts/benchmark-100k.js
    depends_on:
      - prometheus
```

#### `prometheus.yml`
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['host.docker.internal:9090']
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['host.docker.internal:8081']
```

#### `grafana-datasources.yml`
```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

---

### 2. Launch the Stack

Start the Prometheus and Grafana containers in the background:

```bash
docker compose up -d
```

---

### 3. Run Your k6 Test

Execute your local k6 script and stream the results directly to the Prometheus remote write receiver endpoint:

```bash
K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
k6 run -o experimental-prometheus-rw your-script.js
```

---

### 4. View Metrics in Grafana

1. Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
2. In the top-right corner, click the **`+`** icon (or navigate to **Dashboards** > **New** > **Import**).
3. Type the official Dashboard ID **`19665`** and click **Load**.
4. Choose **Prometheus** from the data source dropdown.
5. Click **Import** to start visualizing virtual users, request rates, and response time percentiles.
6. Add another dashboard using same above process for Dashboard Id **`19004`** for JVM metrics 


### Hard prune docker network in case of grafana and prometheus communication fails
```bash
docker network prune -f
```

🎥 **Watch the full breakdown & step-by-step code walkthrough:**
[![Watch the video](https://img.youtube.com/vi/uOz3MZqHDuo/0.jpg)](https://www.youtube.com/watch?v=uOz3MZqHDuo)
