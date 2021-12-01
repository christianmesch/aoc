package io.christianmesch.aoc18.day05;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class Day05 {
  private static final String INPUT_FILENAME = "/day5.txt";
  private static final Pattern PATTERN;

  static {
    StringBuilder p = new StringBuilder();
    for (char c = 'a'; c < 'z'; c++) {
      p.append("" + c + Character.toUpperCase(c))
          .append('|')
          .append("" + Character.toUpperCase(c) + c)
          .append('|');
    }
    p.append("zZ|Zz");

    PATTERN = Pattern.compile(p.toString());
  }

  public static void main(String... args) {
    Day05 day = new Day05();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private int part1() throws Exception {
    String input = InputUtils.read(INPUT_FILENAME).get(0);

    return lengthAfterReactions(input);
  }

  private int part2() throws Exception {
    String input = InputUtils.read(INPUT_FILENAME).get(0);

    return Stream.of("abcdefghijklmnopqrstuvwxyz".split("")).parallel()
        .map(c -> lengthAfterReactions(input.replaceAll("(?i)" + c, "")))
        .sorted()
        .findFirst()
        .orElse(-1);
  }

  private int lengthAfterReactions(String input) {
    Matcher matcher = PATTERN.matcher(input);
    if (matcher.find()) {
      return lengthAfterReactions(matcher.replaceAll(""));
    }

    return input.length();
  }


}
