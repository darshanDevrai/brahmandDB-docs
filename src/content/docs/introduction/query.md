---
title: How Queries Work
description: How Brahmand processes Cypher queries into ClickHouse SQL
---

Cypher is a declarative query language for graphs, and should be simple to read and write for anyone who is familiar with SQL. Brahmand’s implementation of Cypher is based on the openCypher standard.


Brahmand processes each Cypher query in three high-level phases:

1. **Parse & Anchor Selection**  
   - Identify an “anchor” node to start traversal.  
   - Current heuristic: pick the node with the most `WHERE` predicates; if tied, choose the node with more properties referenced in `RETURN`.  
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
MATCH (p:Post)-[:CREATED]->(u:User)
WHERE p.PostTypeId = 2
RETURN u.UserId AS UserId, u.DisplayName
ORDER BY p.created_date DESC
LIMIT 10;
```

### ClickHouse SQL query
```sql
WITH Post_p AS (
    SELECT postId FROM Post WHERE PostTypeId = 2
),
CREATED_incoming_ab7d65838c AS (
    SELECT 
        from_id, 
        arrayJoin(bitmapToArray(to_id)) AS to_id 
    FROM CREATED_incoming WHERE from_id IN (SELECT postId FROM Post_p)
)
SELECT 
    u.UserId AS UserId, 
    u.DisplayName 
FROM User AS u    
JOIN CREATED_incoming_ab7d65838c AS ab7d65838c 
ON ab7d65838c.to_id = u.UserId 
JOIN Post_p AS p ON p.postId = ab7d65838c.from_id   
GROUP BY UserId, u.DisplayName 
ORDER BY p.created_date DESC  
LIMIT 10
```

<!-- **Explanation:** -->
#### Explanation:

- **Anchor Node**: Only `Post` has a `WHERE` filter, so it becomes the anchor.
- **Early Filtering**: Applying `PostTypeId = 2` in the `Post_p` CTE limits the data scanned.
- **Edge Traversal**: Traverses the `CREATED` relationship via `CREATED_incoming`.
- **Final Join**: Joins the `User` and `Post_p` CTEs, then applies `GROUP BY`, `ORDER BY`, and `LIMIT` to produce the final result.
