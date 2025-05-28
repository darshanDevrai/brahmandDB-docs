---
title: Import Data
description: Import Data
---

Download the previous example dataset.

<ul>
  <li>
    <a href="/node_users.csv" download>
      node_users.csv
    </a>
  </li>
  <li>
    <a href="/node_posts.csv" download>
      node_posts.csv
    </a>
  </li>
  <li>
    <a href="/rel_follows.csv" download>
      rel_follows.csv
    </a>
  </li>
  <li>
    <a href="/rel_posts.csv" download>
      rel_posts.csv
    </a>
  </li>
  <li>
    <a href="/rel_likes.csv" download>
      rel_likes.csv
    </a>
  </li>
</ul>

---
## Ingest the data
Currently, the `brahmand-client` and HTTP interface do not support data import. You must use the ClickHouse client to load data directly into your ClickHouse tables. Native import functionality is planned for a future release.

Considering you are running brahmand with the docker compose configuration, use following commands to import the data.

First, copy your downloaded CSVs into the same folder as your docker-compose.yml. Then, from that folder, run:
### Node User
```bash
docker compose exec -T clickhouse-service \
  clickhouse-client --database=brahmand \
  --query="INSERT INTO User FORMAT CSVWithNames" < node_users.csv

```
### Node Post
```bash
docker compose exec -T clickhouse-service \
  clickhouse-client --database=brahmand \
  --query="INSERT INTO Post FORMAT CSVWithNames" < node_posts.csv

```
### Relationship FOLLOWS
```bash
docker compose exec -T clickhouse-service \
  clickhouse-client --database=brahmand \
  --query="INSERT INTO FOLLOWS FORMAT CSVWithNames" < rel_follows.csv

```

### Relationship POSTS
```bash
docker compose exec -T clickhouse-service \
  clickhouse-client --database=brahmand \
  --query="INSERT INTO POSTS FORMAT CSVWithNames" < rel_posts.csv

```

### Relationship LIKES
```bash
docker compose exec -T clickhouse-service \
  clickhouse-client --database=brahmand \
  --query="INSERT INTO LIKES FORMAT CSVWithNames" < rel_likes.csv

```

---


Considering you are running brahmand with the docker compose configuration, to launch ClickHouse client, use this following command - 
```bash
docker compose exec clickhouse-service clickhouse-client \
  --host clickhouse-service \
  --port 9000 \
  --user test_user \
  --password test_pass \
  --database brahmand


```
