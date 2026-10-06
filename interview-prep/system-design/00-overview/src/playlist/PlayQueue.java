package playlist;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * The "Up Next" line in a music app.
 *
 * Called PlayQueue and not Playlist on purpose: playing a song CONSUMES it
 * here, and a saved playlist does not shrink when you listen to it. The name
 * has to match the behaviour.
 *
 * Ownership is the one place this design genuinely differs from the Deck:
 *
 *   Deck      CREATES its cards. They do not exist anywhere else and they die
 *             with the deck.                                 -> composition
 *
 *   PlayQueue is HANDED songs that already exist in a library and go on
 *             existing after the queue is emptied.            -> aggregation
 *
 * Note the split that follows from that: the queue does not own the Songs, but
 * it does own its own LIST of them -- hence the defensive copy in of().
 * Shared contents, private ordering.
 */
public class PlayQueue {

    private final List<Song> songs;

    private PlayQueue(List<Song> songs) {
        this.songs = songs;
    }

    /** Defensive copy: the caller keeps their list, we get our own ordering. */
    public static PlayQueue of(List<Song> songs) {
        Objects.requireNonNull(songs, "songs");
        return new PlayQueue(new ArrayList<>(songs));
    }

    public static PlayQueue empty() {
        return new PlayQueue(new ArrayList<>());
    }

    public void add(Song song) {
        songs.add(Objects.requireNonNull(song, "song"));
    }

    public void shuffle(Shuffler shuffler) {
        shuffler.shuffle(songs);
    }

    /**
     * A queue plays from the FRONT, where the deck dealt from the end.
     * On an ArrayList that makes this O(n) rather than O(1) -- irrelevant at
     * playlist sizes, and module 01 revisits it when ArrayDeque shows up.
     */
    public Song playNext() {
        if (isEmpty()) {
            throw new IllegalStateException("queue is empty");
        }
        return songs.remove(0);
    }

    public int remaining() {
        return songs.size();
    }

    public boolean isEmpty() {
        return songs.isEmpty();
    }

    public int totalSeconds() {
        int total = 0;
        for (Song song : songs) {
            total += song.seconds();
        }
        return total;
    }

    /** Read-only view. Callers can look; only PlayQueue can reorder. */
    public List<Song> songs() {
        return Collections.unmodifiableList(songs);
    }
}
