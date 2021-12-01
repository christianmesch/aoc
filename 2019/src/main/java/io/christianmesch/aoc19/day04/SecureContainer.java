package io.christianmesch.aoc19.day04;

import java.util.function.Predicate;
import java.util.stream.IntStream;

public class SecureContainer {

    private static final int INPUT_START = 136760;
    private static final int INPUT_END = 595730;

    public static void main(String... args) {
        SecureContainer day = new SecureContainer();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private long part1() {
        return IntStream.range(INPUT_START, INPUT_END)
                .mapToObj(String::valueOf)
                .filter(hasAdjacent().and(neverDecreasing()))
                .count();
    }

    private long part2() {
        return IntStream.range(INPUT_START, INPUT_END)
                .mapToObj(String::valueOf)
                .filter(hasExactlyTwoAdjacent().and(neverDecreasing()))
                .count();
    }

    private Predicate<String> hasAdjacent() {
        return e -> {
            for(int i = 1; i < e.length(); i++) {
                if (e.charAt(i - 1) == e.charAt(i)) return true;
            }
            return false;
        };
    }

    private Predicate<String> hasExactlyTwoAdjacent() {
        return e -> {
          int num = 1;
          for(int i = 1; i < e.length(); i++) {
              if (e.charAt(i - 1) == e.charAt(i)) {
                  num++;
              } else {
                  if (num == 2) return true;
                  num = 1;
              }
          }
          return num == 2;
        };
    }

    private Predicate<String> neverDecreasing() {
        return e -> {
            for(int i = 1; i < e.length(); i++) {
                if (e.charAt(i - 1) > e.charAt(i)) return false;
            }
            return true;
        };
    }
}
