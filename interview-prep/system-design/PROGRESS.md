# Progress

Source of truth for what has been taught, drilled and mastered. The checkboxes inside the HTML
pages are a browser-side convenience; this file is the record.

**Status values:** `not started` · `taught` (explained, not yet drilled) · `drilling` (in the
ladder) · `mastered` (all four gate conditions cleared)

**Mastery gate** — all four, or the topic does not move:
1. Five consecutive drills correct, including at least one *explain-why*
2. Mermaid diagram produced unaided
3. Code compiles and runs in one or two tries
4. Can state when *not* to use it

---

## Session log

| # | Date | What happened |
| --- | --- | --- |
| 1 | 2026-10-05 | Notes system built. Taught the 9-step LLD pipeline end to end via Deck of Cards (`00-overview/lld-process-map.html`); Java compiled and run under JDK 17. No drills — map session by design. |
| 1b | 2026-10-06 | Cards are an unfamiliar domain, so added a second worked example in music (`00-overview/music-queue.html`): the Up Next queue, same nine steps. Not a reskin — it lands aggregation-vs-composition and "identity is designed" by *disagreeing* with the deck. Ends with a side-by-side table: 8 rows same, 2 different. |

---

## 00 — Overview

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| The LLD pipeline (Deck of Cards) | taught | 2026-10-05 | — |
| The same pipeline, in music (Up Next queue) | taught | 2026-10-06 | — |

## 01 — Java for design

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| interface vs abstract class | **next up** | — | — |
| enums with fields and methods | not started | — | — |
| generics, enough to model with | not started | — | — |
| collections: List vs Set vs Map | not started | — | — |
| equals and hashCode | not started | — | — |
| immutability, final, defensive copies | not started | — | — |
| Comparable vs Comparator | not started | — | — |
| Optional instead of null | not started | — | — |
| records (after the longhand is drilled) | not started | — | — |

## 02 — UML and Mermaid notation

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| the class box: visibility, types, static, abstract | not started | — | — |
| association | not started | — | — |
| aggregation vs composition | not started | — | — |
| inheritance and realisation | not started | — | — |
| dependency | not started | — | — |
| multiplicity | not started | — | — |
| reading someone else's diagram | not started | — | — |
| sequence diagrams (light) | not started | — | — |

## 03 — Class modeling

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| clarifying questions worth asking | not started | — | — |
| noun extraction | not started | — | — |
| class vs attribute vs enum vs noise | not started | — | — |
| the one-sentence responsibility test | not started | — | — |
| naming things | not started | — | — |
| entity vs service vs controller | not started | — | — |
| when not to make a class | not started | — | — |

## 04 — Relationships and object modeling

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| has-a vs is-a | not started | — | — |
| composition over inheritance | not started | — | — |
| bidirectional links and ownership | not started | — | — |
| the interface as a seam | not started | — | — |
| enums vs class hierarchies for variants | not started | — | — |
| who holds state, who holds behaviour | not started | — | — |

## 05 — SOLID

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| S — Single Responsibility | not started | — | — |
| O — Open/Closed | not started | — | — |
| L — Liskov Substitution | not started | — | — |
| I — Interface Segregation | not started | — | — |
| D — Dependency Inversion | not started | — | — |

## 06 — Design patterns

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| Creational (Factory Method, Abstract Factory, Builder, Singleton, Prototype) | not started | — | — |
| Structural (Adapter, Decorator, Composite, Facade, Proxy, Bridge, Flyweight) | not started | — | — |
| Behavioural (Strategy, Observer, State, Command, Template Method, CoR, Iterator, Mediator, Visitor) | not started | — | — |

## 07 — Full problems

| Topic | Status | Taught | Last drilled |
| --- | --- | --- | --- |
| Deck of Cards (revisited, driven by me) | not started | — | — |
| Vending Machine | not started | — | — |
| Parking Lot | not started | — | — |
| Elevator | not started | — | — |
| Tic-Tac-Toe | not started | — | — |
| Snake and Ladder | not started | — | — |
| Splitwise | not started | — | — |
| Library Management | not started | — | — |
| Logging Framework | not started | — | — |
| Rate Limiter | not started | — | — |
| LRU Cache | not started | — | — |
| Chess | not started | — | — |
| Food Delivery | not started | — | — |
| BookMyShow | not started | — | — |

---

## Open threads

Design debts deliberately left in worked examples, to be collected when the relevant module
arrives. Each one is a ready-made drill.

| From | Debt | Collect in |
| --- | --- | --- |
| Deck of Cards | `Rank.value()` hardcodes aces-high — a game rule inside a deck type | 05 — Single Responsibility |
| Deck of Cards | `Deck.standard52()` means Deck knows how to build itself | 06 — creational |
| Deck of Cards | `cards()` returns an unmodifiable *view*, not a copy — it mutates under the caller | 01 — immutability |
| Deck of Cards | `Shuffler` is Strategy, arrived at without naming it | 06 — behavioural |
| Deck of Cards | no discard pile / reset; not thread-safe | 07 — full problems |
| Music queue | `Song.equals` ignores duration — studio and live cuts collide | 01 — equals and hashCode |
| Music queue | `artist` is a bare `String` — "The Beatles" ≠ "Beatles" | 03 — class vs attribute |
| Music queue | `Genre.Energy` was invented, not requested — state nobody asked for | 03 — when not to make a class |
| Music queue | `Shuffler` written twice, once per domain — one `Shuffler<T>` should serve both | 01 — generics |
| Music queue | `playNext()` removes from the front of an `ArrayList`, O(n) | 01 — collections (`ArrayDeque`) |
| Music queue | `songs()` returns an unmodifiable *view*, not a copy | 01 — immutability |
| Both examples | the two designs disagree on ownership: composition vs aggregation | 02 — aggregation vs composition |

---

## Environment

- **Java 17** — `C:\Program Files\Eclipse Adoptium\jdk-17.0.6.10-hotspot` (`JAVA_HOME`).
  `java` on `PATH` resolves to JDK 11, so compile commands pin 17 explicitly.
- Compile and run a topic's sources, from inside that topic folder:
  ```
  "$JAVA_HOME/bin/javac" -encoding UTF-8 -d out $(find src -name '*.java')
  "$JAVA_HOME/bin/java" -cp out <pkg>.<MainClass>
  ```
- `out/` folders are disposable build output.
- Diagrams render from the vendored `assets/mermaid.min.js` (v10.9.3, UMD) — no network, no build
  step, no server. Open any page by double-clicking it.
