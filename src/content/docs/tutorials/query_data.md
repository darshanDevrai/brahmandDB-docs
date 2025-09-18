---
title: Import Data
description: Import Data
---

Run `brahmand-client` :
```

docker compose exec brahmand brahmand-client

```

## MATCH 
### MATCH a Node pattern
Let’s say we want to match only `User` nodes in the database. We can do this by specifying the label in the `MATCH` clause.
```cypher

MATCH (a:User) 
RETURN a.userId, a.username, a.account_creation_date LIMIT 3;

```
```
   ┌─userId─┬─username─┬─account_creation_date─┐
1. │      3 │ Aragon   │   2025-02-25 00:00:00 │
2. │      4 │ Gandalf  │   2025-05-11 00:00:00 │
3. │      5 │ Sauron   │   2025-06-11 00:00:00 │
   └────────┴──────────┴───────────────────────┘


```

### Match a relationship pattern
You can match a relationship pattern by specifying the relationship in the MATCH clause.
```cypher
MATCH (a:User)-[r:LIKES]->(b:Post) 
RETURN a.userId, a.username, a.account_creation_date;

```
This will give users who has liked any post.
```
   ┌─userId─┬─username─┬─account_creation_date─┐
1. │      3 │ Aragon   │   2025-02-25 00:00:00 │
2. │      4 │ Gandalf  │   2025-05-11 00:00:00 │
3. │      2 │ Sam      │   2025-01-27 00:00:00 │
4. │      1 │ Frodo    │   2025-09-09 00:00:00 │
   └────────┴──────────┴───────────────────────┘


```

### Match multiple patterns
You can combine multiple match clauses that each specify a particular pattern.
```cypher
MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(c:User),
      (a)-[:FOLLOWS]->(c)
RETURN
  a.username AS user1,
  b.username AS user2,
  c.username AS user3
LIMIT 5;

```
The above query is the same as having written the following two match clauses one after the other.

```cypher

MATCH (a:User)-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(c:User)
RETURN
  a.username AS user1,
  b.username AS user2,
  c.username AS user3
LIMIT 5;

```

```
   ┌─user1─┬─user2─┬─user3───┐
1. │ Sam   │ Frodo │ Aragon  │
2. │ Sam   │ Frodo │ Gandalf │
   └───────┴───────┴─────────┘


```




## WHERE 
The `WHERE` clause allows you to specify predicates/constraints on a part of your query. The query below shows how to filter the results to only include users whose account was created before a particular date.

```cypher
MATCH (a:User)
WHERE a.account_creation_date < DATE('2025-02-01')
RETURN a.username, a.account_creation_date
LIMIT 3;

```
```
   ┌─username─┬─account_creation_date─┐
1. │ Sam      │   2025-01-27 00:00:00 │
   └──────────┴───────────────────────┘

```

## Grouping and Aggregation

Cypher does not have an explicit `GROUP BY` clause. Instead, you can simply apply an aggregation function in the `RETURN` clause and group by the specified property. The following query returns the total number of posts.
```cypher
MATCH (p:Post)
RETURN COUNT(p) AS num_posts;

```

```
   ┌─num_posts─┐
1. │         5 │
   └───────────┘

```
The following example shows how to group by the `userId` property and return the number of posts for each user.
```cypher
MATCH (u:User)-[:POSTS]->(p:Post)
RETURN u.userId, COUNT(p) AS num_posts
LIMIT 3;

```
```
   ┌─userId─┬─num_posts─┐
1. │      4 │         1 │
2. │      3 │         1 │
3. │      2 │         1 │
   └────────┴───────────┘

```

## ORDER BY 
The `ORDER BY` clause is used to sort the results of a query. The following query returns all users sorted in descending order of the number of posts they have liked.
```cypher
MATCH (u:User)-[:LIKES]->(p:Post)
RETURN u.username, COUNT(p) AS num_posts
ORDER BY num_posts DESC
LIMIT 3;

```
```
   ┌─username─┬─num_posts─┐
1. │ Aragon   │         2 │
2. │ Gandalf  │         1 │
3. │ Sam      │         1 │
   └──────────┴───────────┘

```

## Other Clauses

Brahmand currently does not support the following Cypher clauses—`WITH`, `CASE`, `UNWIND`, `CREATE`, `SET`, `REMOVE`, and `DELETE`—but support for these is planned in a future release.
