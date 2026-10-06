package playlist;

import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/** Runs the design, so the behaviour is observed rather than assumed. */
public final class PlayQueueDemo {

    public static void main(String[] args) {
        PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);

        // The library: songs that exist independently of any queue.
        List<Song> library = new ArrayList<>(Arrays.asList(
                new Song("Neon Avenue", "The Glass Hours", Genre.POP, 198),
                new Song("Slow Tide", "Marina Vale", Genre.LOFI, 241),
                new Song("Steel Garden", "Ninefold", Genre.ROCK, 276),
                new Song("Blue Hour", "Oscar Mbeki Trio", Genre.JAZZ, 324),
                new Song("Static Bloom", "The Glass Hours", Genre.POP, 213),
                new Song("Counting Rain", "Marina Vale", Genre.LOFI, 187)));

        PlayQueue queue = PlayQueue.of(library);
        out.println("library size    : " + library.size() + " songs");
        out.println("queued          : " + queue.remaining() + " songs, "
                + (queue.totalSeconds() / 60) + " minutes");
        out.println("up next         : " + queue.songs().subList(0, 3));

        queue.shuffle(new RandomShuffler(7L));
        out.println("after shuffle   : " + queue.songs().subList(0, 3) + " ...");

        out.println();
        out.println("now playing     : " + queue.playNext());
        out.println("now playing     : " + queue.playNext());
        out.println("remaining       : " + queue.remaining() + " songs");

        queue.add(new Song("Harbour Lights", "Ninefold", Genre.ROCK, 252));
        out.println("after add       : " + queue.remaining() + " songs");

        out.println();
        Song studio = new Song("Slow Tide", "Marina Vale", Genre.LOFI, 241);
        Song remaster = new Song("Slow Tide", "Marina Vale", Genre.POP, 255);
        out.println("value equality  : studio == remaster ? " + (studio == remaster)
                + "   studio.equals(remaster) ? " + studio.equals(remaster));
        out.println("                  (identity is title + artist only -- see the critique)");

        out.println();
        out.println("the seam -- swap the shuffling policy, PlayQueue is untouched:");
        queue.shuffle(songs -> Collections.reverse(songs));
        out.println("reversed, next  : " + queue.songs().get(0));

        out.println();
        while (!queue.isEmpty()) {
            queue.playNext();
        }
        out.println("queue drained   : " + queue.remaining() + " songs left");
        out.println("library still   : " + library.size() + " songs  <-- aggregation, not");
        out.println("                  composition: the songs outlived the queue");

        out.println();
        try {
            queue.playNext();
        } catch (IllegalStateException e) {
            out.println("guard rail      : " + e.getMessage());
        }
    }
}
