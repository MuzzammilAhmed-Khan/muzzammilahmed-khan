package deck;

import java.util.Objects;

/**
 * An immutable value object: a card is defined entirely by what it is, not by
 * which object instance it happens to be. Two separately constructed aces of
 * spades are the same card, and that is exactly what equals/hashCode express.
 *
 * Written longhand on purpose. Java 17 collapses all of this into
 *     public record Card(Suit suit, Rank rank) {}
 * but you cannot appreciate what the record hides until you have written out
 * what it hides.
 */
public final class Card {

    private final Suit suit;
    private final Rank rank;

    public Card(Suit suit, Rank rank) {
        this.suit = Objects.requireNonNull(suit, "suit");
        this.rank = Objects.requireNonNull(rank, "rank");
    }

    public Suit suit() { return suit; }

    public Rank rank() { return rank; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Card)) return false;
        Card other = (Card) o;
        return suit == other.suit && rank == other.rank;
    }

    @Override
    public int hashCode() {
        return Objects.hash(suit, rank);
    }

    @Override
    public String toString() {
        return rank.label() + suit.symbol();
    }
}
