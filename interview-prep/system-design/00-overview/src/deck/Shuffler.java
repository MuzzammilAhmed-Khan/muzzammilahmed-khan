package deck;

import java.util.List;

/**
 * The seam. Deck knows that shuffling happens; it does not know how.
 * Swapping in a different algorithm needs no change to Deck at all.
 *
 * One abstract method, so any lambda of the right shape is a Shuffler.
 */
public interface Shuffler {

    void shuffle(List<Card> cards);
}
