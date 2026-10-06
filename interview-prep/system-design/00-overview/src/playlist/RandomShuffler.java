package playlist;

import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Fisher-Yates, with the randomness injected rather than reached for, so the
 * shuffle can be made repeatable for tests and for these notes.
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
    public void shuffle(List<Song> songs) {
        for (int i = songs.size() - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            Collections.swap(songs, i, j);
        }
    }
}
