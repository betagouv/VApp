# Choose Kysely instead of an ORM

## Context

Choose a persistence / querying layer between the Postgres database and the NextJs database.

## Decision

I choose **Kysely** instead of an ORM like **Prisma**, to interact wth the Postres database.

### Pros

- Persistence needs are simple for now
- Separation of concerns
  - **Domain modeling is driven by the domain, not by the database**
- Powerful query language :
  - Type safe
  - Efficiency : each query is tailor-made and explicit no risk to retrieve the entire because of cascading hydration.
  - Baking custom queries with Postgres magic-fu is possible
- Basic migrations system (enough for the job)

### Cons

- Manuel query, queries may take longer to write
- Migrations need to be written manually (there is no diff tool to generate a migration auto-magically)
