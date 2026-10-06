package deck;

import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Fisher-Yates. Seeding is exposed through a constructor so that tests (and
 * these notes) can get a repeatable shuffle. That is a design decision rather
 * than a detail: the randomness is injected rather than reached for.
 */
public final class RandomShuffler implements Shuffler {

    private final Random random;

    public RandomShuffler() {
        this(new Random());
    }

    public RandomShuffler(long seed) {
        this(new Random(seed));
    }

    private RandomShuffler(Random random) {
        this.random = random;
    }

    @Override
    public void shuffle(List<Card> cards) {
        for (int i = cards.size() - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            Collections.swap(cards, i, j);
        }
    }
}
