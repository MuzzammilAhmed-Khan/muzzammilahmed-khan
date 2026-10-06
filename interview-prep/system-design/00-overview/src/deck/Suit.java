package deck;

/**
 * A suit is one of exactly four values, and each value carries data of its
 * own (a symbol, a colour). That shape -- a closed set, with state and
 * behaviour attached -- is why this is an enum rather than a String field
 * sitting on Card.
 */
public enum Suit {

    CLUBS("♣", Colour.BLACK),
    DIAMONDS("♦", Colour.RED),
    HEARTS("♥", Colour.RED),
    SPADES("♠", Colour.BLACK);

    public enum Colour { RED, BLACK }

    private final String symbol;
    private final Colour colour;

    Suit(String symbol, Colour colour) {
        this.symbol = symbol;
        this.colour = colour;
    }

    public String symbol() { return symbol; }

    public Colour colour() { return colour; }
}
