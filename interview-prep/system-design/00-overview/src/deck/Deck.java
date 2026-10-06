package deck;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Owns its cards: the list is created here, never handed in, and never handed
 * out in mutable form. In UML that ownership is composition -- the filled
 * diamond -- and it is the reason nobody outside can bend the deck.
 *
 * Top of the deck is the END of the list, which makes dealing O(1).
 */
public class Deck {

    private final List<Card> cards;

    private Deck(List<Card> cards) {
        this.cards = cards;
    }

    /** Static factory: names the intent, and keeps construction in one place. */
    public static Deck standard52() {
        List<Card> cards = new ArrayList<>(52);
        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                cards.add(new Card(suit, rank));
            }
        }
        return new Deck(cards);
    }

    public void shuffle(Shuffler shuffler) {
        shuffler.shuffle(cards);
    }

    public Card deal() {
        if (isEmpty()) {
            throw new IllegalStateException("deck is empty");
        }
        return cards.remove(cards.size() - 1);
    }

    public List<Card> deal(int count) {
        if (count < 0) {
            throw new IllegalArgumentException("count must not be negative: " + count);
        }
        if (count > remaining()) {
            throw new IllegalStateException(
                    "asked for " + count + " cards, only " + remaining() + " left");
        }
        List<Card> hand = new ArrayList<>(count);
        for (int i = 0; i < count; i++) {
            hand.add(deal());
        }
        return hand;
    }

    public int remaining() {
        return cards.size();
    }

    public boolean isEmpty() {
        return cards.isEmpty();
    }

    /** Read-only view. Callers can look; only Deck can change. */
    public List<Card> cards() {
        return Collections.unmodifiableList(cards);
    }
}
