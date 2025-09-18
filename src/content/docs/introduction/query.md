---
title: How Queries Work
description: How Brahmand processes Cypher queries into ClickHouse SQL
---

Cypher is a declarative query language for graphs, and should be simple to read and write for anyone who is familiar with SQL. Brahmand’s implementation of Cypher is based on the openCypher standard.


Brahmand processes each Cypher query in three high-level phases:

1. **Parse & Anchor Selection**  
   - Identify an “anchor” node to start traversal.  
   - Current heuristic: pick the node with the most `WHERE` predicates.  
   - (Future: cost-based optimization.)

2. **Traversal Planning**  
   - Build ClickHouse Common Table Expressions (CTEs) that traverse edges using the main edge table and precomputed edge‐index tables.  
   - Apply `WHERE` filters as early as possible on the anchor to limit data volume.

3. **Join & Final SELECT**  
   - Join the intermediate CTEs once traversal reaches the target node(s).  
   - Assemble the final `SELECT` with any remaining filters, `GROUP BY`, `ORDER BY`, and `LIMIT`.

## Example 
### Cypher Query

```cypher
MATCH (a:User)-[:LIKES]->(p:Post)
WHERE a.account_creation_date < DATE('2025-02-01')
RETURN a.username, a.account_creation_date, COUNT(p) AS num_posts
LIMIT 3;
```

### ClickHouse SQL query
```sql
WITH User_a AS (
    SELECT 
      username, 
      account_creation_date, 
      userId
    FROM User
    WHERE account_creation_date < DATE('2025-02-01')
), 
LIKES_a0e174cec8 AS (
    SELECT 
      from_User AS from_id, 
      to_Post AS to_id
    FROM LIKES
    WHERE from_id IN (SELECT userId FROM User_a)
)
SELECT 
      a.username, 
      a.account_creation_date, 
      COUNT(p.postId) AS num_posts
FROM Post AS p
INNER JOIN LIKES_a0e174cec8 AS a0e174cec8 ON a0e174cec8.to_id = p.postId
INNER JOIN User_a AS a ON a.userId = a0e174cec8.from_id
GROUP BY a.username, a.account_creation_date
LIMIT  3  
```

<!-- **Explanation:** -->
#### Explanation:

- **Anchor Node**: Only `User` has a `WHERE` filter, so it becomes the anchor.
- **Early Filtering**: Applying `account_creation_date < DATE('2025-02-01')` in the `User_a` CTE limits the data scanned.
- **Edge Traversal**: Traverses the `LIKES` relationship via `LIKES_a0e174cec8`.
- **Final Join**: Joins the `User_a`  CTEs with `Post` table, then applies `GROUP BY`, and `LIMIT` to produce the final result.
