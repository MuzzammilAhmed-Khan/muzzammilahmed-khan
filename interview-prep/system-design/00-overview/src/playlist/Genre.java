package playlist;

/**
 * A closed set of values, each carrying data of its own. Exactly the same
 * shape as Suit in the deck example -- different domain, identical reasoning:
 * the set is fixed and known, so it is an enum rather than a String.
 */
public enum Genre {

    POP("Pop", Energy.HIGH),
    ROCK("Rock", Energy.HIGH),
    HIP_HOP("Hip-Hop", Energy.HIGH),
    JAZZ("Jazz", Energy.MEDIUM),
    CLASSICAL("Classical", Energy.LOW),
    LOFI("Lo-fi", Energy.LOW);

    public enum Energy { LOW, MEDIUM, HIGH }

    private final String label;
    private final Energy energy;

    Genre(String label, Energy energy) {
        this.label = label;
        this.energy = energy;
    }

    public String label() { return label; }

    public Energy energy() { return energy; }
}
