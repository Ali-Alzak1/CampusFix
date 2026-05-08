# CampusFix 

CampusFix is a database project for managing maintenance reports on campus. Think of it like a system where students or staff can report a broken AC, a leaking pipe, or a busted light — and the database keeps track of everything from the moment it's reported until someone fixes it.

The main work is the SQL. There's also a small web app included if you want to see the data come to life visually, but it's optional.

---

## The SQL files

These are the four files that matter most:

| File | What it does |
|------|-------------|
| `01_create_tables.sql` | Creates all the tables, sets up the relationships between them, and adds the constraints |
| `02_insert_data.sql` | Fills the tables with realistic sample data |
| `03_verify_queries.sql` | Runs 12 queries to check that the data and logic are working correctly |
| `04_constraint_tests.sql` | Tries to break the rules on purpose — to prove the constraints actually work |

To run them, open `psql` and go in order:

```sql
\i 01_create_tables.sql
\i 02_insert_data.sql
\i 03_verify_queries.sql
\i 04_constraint_tests.sql
```

---

## What's in the database

At its core, the database answers one question: *what's broken, who's fixing it, and how long is it taking?*

Here's what each table stores:

- **Report** — the issue itself. What's wrong, where, how urgent, and who reported it.
- **User** — everyone in the system: students who submit reports, and maintenance staff who fix things.
- **Facility** — the campus locations (buildings, rooms, outdoor areas). Each one belongs to an administrative unit.
- **Assignment** — who got assigned to fix a report, and when they finished.
- **StatusHistory** — a running log of every status change a report goes through. Once written, these rows can't be changed.

There are also smaller lookup tables for things like priority levels, status names, and categories — so instead of typing "High Priority" as free text, everything links back to a controlled list.

**A few rules the database enforces:**
- You can't close a report unless it has a completed assignment.
- Status history is write-only — no editing or deleting past entries.
- Every facility must belong to a real administrative unit.

---

## The 12 verification queries

`03_verify_queries.sql` has 12 queries that act as a sanity check on the data. Here's what each one looks at:

| Query | Question it answers |
|-------|-------------------|
| Q1 | How many reports are in each status? |
| Q2 | Which reports haven't been assigned to anyone yet? |
| Q3 | On average, how long does each category take to resolve? |
| Q4 | Which reports went past their SLA deadline? |
| Q5 | How many open vs completed reports does each staff member have? |
| Q6 | Which facilities have the most open issues? |
| Q7 | How are reports spread across priority levels? |
| Q8 | How many reports were resolved on time, broken down by priority? |
| Q9 | How many reports were submitted each month? |
| Q10 | Are there any reports where the status changes don't make sense chronologically? |
| Q11 | Who submits the most reports? |
| Q12 | How long does it usually take from submission to first assignment? |

---

## The web app (optional)

There's a React app in the `campusfix-ui/` folder that turns the data into charts and tables. It's useful for presenting the project, but it doesn't need a real database — it runs off a copy of the seed data built into the code.

To start it:

```bash
cd campusfix-ui
npm install
npm run dev
```

The dashboard numbers match the verification queries exactly, so you can cross-check them against `03_verify_queries.sql` if you want to confirm everything lines up.