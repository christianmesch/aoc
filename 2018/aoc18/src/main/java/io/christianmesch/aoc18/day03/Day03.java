package io.christianmesch.aoc18.day03;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Day03 {

  private static final String INPUT_FILENAME = "/day3.txt";
  private static final Pattern PATTERN = Pattern.compile("^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$");

  public static void main(String... args) {
    Day03 day = new Day03();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private long part1() throws Exception {
    return InputUtils.read(INPUT_FILENAME).stream()
        .map(PATTERN::matcher)
        .filter(Matcher::matches)
        .map(matcher -> {
          List<String> coordinates = new ArrayList<>();
          int startX = Integer.parseInt(matcher.group(2));
          int startY = Integer.parseInt(matcher.group(3));
          int width = Integer.parseInt(matcher.group(4));
          int height = Integer.parseInt(matcher.group(5));

          for (int x = startX; x < startX + width; x++) {
            for (int y = startY; y < startY + height; y++) {
              coordinates.add(x + ", " + y);
            }
          }

          return coordinates;
        })
        .flatMap(List::stream)
        .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
        .entrySet()
        .stream()
        .filter(e -> e.getValue() > 1)
        .count();
  }

  private int part2() throws Exception {
    List<Rectangle> rectangles = InputUtils.read(INPUT_FILENAME).stream()
        .map(PATTERN::matcher)
        .filter(Matcher::matches)
        .map(matcher -> {
          List<String> coordinates = new ArrayList<>();
          int startX = Integer.parseInt(matcher.group(2));
          int startY = Integer.parseInt(matcher.group(3));
          int width = Integer.parseInt(matcher.group(4));
          int height = Integer.parseInt(matcher.group(5));

          for (int x = startX; x < startX + width; x++) {
            for (int y = startY; y < startY + height; y++) {
              coordinates.add(x + ", " + y);
            }
          }

          return new Rectangle(Integer.parseInt(matcher.group(1)), coordinates);
        }).collect(Collectors.toList());

    List<String> uniqueCoordinates = rectangles.stream()
        .flatMap(r -> r.coordinates.stream())
        .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
        .entrySet()
        .stream()
        .filter(e -> e.getValue() == 1)
        .map(Entry::getKey)
        .collect(Collectors.toList());

    for (Rectangle rectangle : rectangles) {
      if (uniqueCoordinates.containsAll(rectangle.coordinates)) {
        return rectangle.id;
      }
    }

    return -1;
  }

  private class Rectangle {
    private final int id;
    private final List<String> coordinates;

    private Rectangle(int id, List<String> coordinates) {
      this.id = id;
      this.coordinates = coordinates;
    }
  }
}
