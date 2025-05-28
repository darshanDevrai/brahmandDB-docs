---
title: Query Interface
description: Query Interface
---


There are two ways you can query brahmand database:

* **CLI**: Write Cypher queries directly in the **brahmand-client** shell
* **http query interface**: Brahmamnd server runs on port **8080**.


## CLI
Check the [installation page](../install) to run the brahmand-client CLI.

## HTTP Query Endpoint

**POST** `/query`

Executes a Cypher query against the brahmand graph database and returns the results in the specified format and mode.

### Request

- **URL**: `http://<host>:<port>/query`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`

### Body Parameters

| Field   | Type   | Required | Default        | Description                                                  | Possible Values                                    |
| ------- | ------ | -------- | -------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| `query` | string | Yes      | —              | A Cypher query string to execute.                            | —                                                  |
| `format`| string | No       | `JSONEachRow`  | Output serialization format.                                 | `JSONEachRow`, `Pretty`, `PrettyCompact`, `CSV`, `CSVWithNames` |
| `mode`  | string | No       | `Cte`          | Traversal mode.                                              | `Cte`, `TempTable`                                 |

### Example

```bash
curl --request POST \
  --url http://0.0.0.0:8080/query \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "MATCH (p:Post)-[:CREATED_BY]->(u:User) RETURN u.Id AS UserId, u.DisplayName, count(p) AS PostCount ORDER BY PostCount DESC LIMIT 10;",
    "format": "JSONEachRow"
  }'
```
### Responses
* **200 OK**
  A successful JSON payload or other serialization according to format.
* **500 Internal Server Error**
  Unexpected server-side error during query execution.