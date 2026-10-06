package deck;

import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

/** Runs the design, so the behaviour is observed rather than assumed. */
public final class DeckDemo {

    public static void main(String[] args) {
        // UTF-8 so the suit symbols survive the Windows console.
        PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);

        Deck deck = Deck.standard52();
        out.println("fresh deck      : " + deck.remaining() + " cards");
        out.println("first five      : " + deck.cards().subList(0, 5));

        deck.shuffle(new RandomShuffler(42L));
        out.println("after shuffle   : " + deck.cards().subList(0, 5) + " ...");

        List<Card> alice = deck.deal(5);
        List<Card> bob = deck.deal(5);
        out.println();
        out.println("alice           : " + alice);
        out.println("bob             : " + bob);
        out.println("remaining       : " + deck.remaining() + " cards");

        out.println();
        Card one = new Card(Suit.SPADES, Rank.ACE);
        Card two = new Card(Suit.SPADES, Rank.ACE);
        out.println("value equality  : one == two ? " + (one == two)
                + "   one.equals(two) ? " + one.equals(two));

        out.println();
        out.println("the seam -- swap the shuffling policy, Deck is untouched:");
        deck.shuffle(cards -> Collections.reverse(cards));
        out.println("reversed, top 3 : "
                + deck.cards().subList(deck.remaining() - 3, deck.remaining()));

        out.println();
        try {
            deck.deal(99);
        } catch (IllegalStateException e) {
            out.println("guard rail      : " + e.getMessage());
        }
    }
}
