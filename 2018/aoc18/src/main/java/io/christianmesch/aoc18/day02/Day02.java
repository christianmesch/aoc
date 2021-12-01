package io.christianmesch.aoc18.day02;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Day02 {

  private static final String INPUT_FILENAME = "/day2.txt";

  public static void main(String... args) {
    Day02 day = new Day02();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private int part1() throws Exception {
    int twice = 0;
    int thrice = 0;

    for (String line : InputUtils.read(INPUT_FILENAME)) {
      Map<String, Integer> frequencies = new HashMap<>();
      for (String c : line.split("")) {
        frequencies.put(c, frequencies.getOrDefault(c, 0) + 1);
      }

      if (frequencies.values().contains(3)) {
        thrice++;
      }

      if (frequencies.values().contains(2)) {
        twice++;
      }
    }

    return twice * thrice;
  }

  private String part2() throws Exception {
    List<String> input = InputUtils.read(INPUT_FILENAME);
    String result;

    for (int i = 0; i < input.size(); i++) {
      String lineA = input.get(i);
      for (int j = i + 1; j < input.size(); j++) {
        String lineB = input.get(j);
        int diffAt = compareStrings(lineA, lineB);

        if (diffAt != -1) {
          return lineA.substring(0, diffAt) + lineA.substring(diffAt + 1);
        }
      }
    }

    return "None found";
  }

  private int compareStrings(String a, String b) {
    boolean foundDiff = false;
    int diffAt = -1;

    for (int i = 0; i < a.length(); i++) {
      if (a.charAt(i) != b.charAt(i)) {
        if (foundDiff) return -1;

        foundDiff = true;
        diffAt = i;
      }
    }

    return diffAt;
  }
}
