---
title: Installation
description: How to install and run Brahmand and the Brahmand client
---

## Docker Compose

The easiest way to start both ClickHouse and Brahmand in one go is with the following `docker-compose.yml`:

```yaml
version: '3.8'

services:
  clickhouse-service:
    image: clickhouse/clickhouse-server:25.5.1
    container_name: clickhouse
    environment:
      CLICKHOUSE_DB: "brahmand"
      CLICKHOUSE_USER: "test_user"
      CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT: "1"
      CLICKHOUSE_PASSWORD: "test_pass"
    ports:
      - "9000:9000"
      - "8123:8123"
    healthcheck:
      test: ["CMD", "clickhouse-client", "--query", "SELECT 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    volumes:
      - clickhouse_data:/var/lib/clickhouse

  brahmand:
    image: darshandevrai/brahmand:latest
    container_name: brahmand
    depends_on:
      clickhouse-service:
        condition: service_healthy
    environment:
      CLICKHOUSE_URL: "http://clickhouse-service:8123"
      CLICKHOUSE_USER: "test_user"
      CLICKHOUSE_PASSWORD: "test_pass"
      CLICKHOUSE_DATABASE: "brahmand"
    ports:
      - "8080:8080"

volumes:
  clickhouse_data:

```
Brahmand-client ships inside the same image. To run it interactively:
```

docker compose exec brahmand brahmand-client

```


---

## Installation via Docker (Standalone)

If you only need Brahmand and already have ClickHouse running:

```bash
# Pull the latest image
docker pull darshandevrai/brahmand:latest

# Run Brahmand
docker run -d \
  --name Brahmand \
  -e CLICKHOUSE_URL=http://localhost:8123 \
  -e CLICKHOUSE_USER=default \
  -e CLICKHOUSE_PASSWORD="" \
  -e CLICKHOUSE_DATABASE=test_g \
  darshandevrai/brahmand:latest


```
To run the client interactively:

```bash
docker run --rm -it \
  darshandevrai/brahmand:latest \
  brahmand-client --url http://brahmand:8080

```

## Binary Installations 

1. Navigate to the [Releases page](https://github.com/<OWNER>/<REPO>/releases).  
2. Download the appropriate archive for your platform:
   - **Linux (x86_64)**  
     - Server: `brahmand-linux-amd64.tar.gz`  
     - Client: `brahmand-client-linux-amd64.tar.gz`
   - **macOS (Intel)**  
     - Server: `brahmand-macos-amd64.tar.gz`  
     - Client: `brahmand-client-macos-amd64.tar.gz`
   - **macOS (Apple Silicon)**  
     - Server: `brahmand-macos-arm64.tar.gz`  
     - Client: `brahmand-client-macos-arm64.tar.gz`
   - **Windows (x86_64)**  
     - Server: `brahmand-win-amd64.zip`  
     - Client: `brahmand-client-win-amd64.zip`
3. Extract and move the binaries:
   ```bash
   # Example for Linux/macOS (GNU)
   tar -xzf brahmand-linux-amd64.tar.gz
   tar -xzf brahmand-client-linux-amd64.tar.gz
   sudo mv brahmand /usr/local/bin/
   sudo mv brahmand-client /usr/local/bin/
   ```
   ```powershell
   # On Windows PowerShell
   Expand-Archive brahmand-win-amd64.zip -DestinationPath .
   Expand-Archive brahmand-client-win-amd64.zip -DestinationPath .
   Move-Item .\brahmand.exe C:\Windows\System32\
   Move-Item .\brahmand-client.exe C:\Windows\System32\
   ```
4. Run Brahmand
   ```bash
    CLICKHOUSE_URL="<clickhouse_url>" \
    CLICKHOUSE_USER="<clickhouse_user>" \
    CLICKHOUSE_PASSWORD="<clickhouse_password>" \
    CLICKHOUSE_DATABASE="<clickhouse_db>" \
    brahmand


   ```
5. Connect cli

   ```bash
    brahmand-client --url <Brahmand URL> # e.g. http://localhost:8080
   ```