package playlist;

import java.util.List;

/**
 * The seam, again. PlayQueue knows that shuffling happens; it does not know
 * how. Compare deck.Shuffler -- the same interface, in a different domain,
 * typed to a different element.
 *
 * That duplication is real and it is deliberate: module 01 shows how one
 * generic Shuffler of T serves both, once generics have been drilled.
 */
public interface Shuffler {

    void shuffle(List<Song> songs);
}
