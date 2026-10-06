package playlist;

import java.util.Objects;

/**
 * An immutable value object, written longhand on purpose.
 *
 * Note what equals() uses: title and artist ONLY. That is a deliberate
 * decision about identity -- it says "a remastered version at a different
 * length is still the same song". It is defensible, and it is also arguably
 * wrong. The critique section of the notes argues the other side.
 *
 * The lesson is that identity is something you DECIDE, not something the
 * fields decide for you.
 */
public final class Song {

    private final String title;
    private final String artist;
    private final Genre genre;
    private final int seconds;

    public Song(String title, String artist, Genre genre, int seconds) {
        this.title = Objects.requireNonNull(title, "title");
        this.artist = Objects.requireNonNull(artist, "artist");
        this.genre = Objects.requireNonNull(genre, "genre");
        if (seconds <= 0) {
            throw new IllegalArgumentException("seconds must be positive: " + seconds);
        }
        this.seconds = seconds;
    }

    public String title() { return title; }

    public String artist() { return artist; }

    public Genre genre() { return genre; }

    public int seconds() { return seconds; }

    /** 198 -> "3:18" */
    public String duration() {
        return (seconds / 60) + ":" + String.format("%02d", seconds % 60);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Song)) return false;
        Song other = (Song) o;
        return title.equals(other.title) && artist.equals(other.artist);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, artist);
    }

    @Override
    public String toString() {
        return title + " - " + artist + " (" + duration() + ")";
    }
}
