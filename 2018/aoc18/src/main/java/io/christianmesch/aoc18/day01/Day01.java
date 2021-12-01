package io.christianmesch.aoc18.day01;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Day01 {

  private static final String INPUT_FILENAME = "/day1.txt";

  public static void main(String... args) {
    Day01 day = new Day01();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private int part1() throws Exception {
    return InputUtils.read(INPUT_FILENAME).stream().mapToInt(Integer::valueOf).sum();
  }

  private int part2() throws Exception {
    List<Integer> input = InputUtils.read(INPUT_FILENAME).stream().map(Integer::valueOf).collect(Collectors.toList());
    Set<Integer> foundFrequencies = new HashSet<>();

    int lastFrequency = 0;
    foundFrequencies.add(0);
    while(true) {
      for (int change : input) {
        lastFrequency += change;

        if (!foundFrequencies.add(lastFrequency)) {
          return lastFrequency;
        }
      }
    }
  }
}