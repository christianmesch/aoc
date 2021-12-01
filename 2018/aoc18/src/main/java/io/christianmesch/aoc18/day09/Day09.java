package io.christianmesch.aoc18.day09;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Day09 {
  private static final String INPUT_FILENAME = "/day9.txt";

  public static void main(String... args) {
    Day09 day = new Day09();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public long part1() throws Exception {
    String input = InputUtils.read(INPUT_FILENAME).get(0);
    int players = Integer.parseInt(input.split(" ")[0]);
    int marbles = Integer.parseInt(input.split(" ")[6]);

    return play(players, marbles);
  }

  public long part2() throws Exception {
    String input = InputUtils.read(INPUT_FILENAME).get(0);
    int players = Integer.parseInt(input.split(" ")[0]);
    int marbles = Integer.parseInt(input.split(" ")[6]) * 100;

    return play(players, marbles);
  }

  public long play(int players, int marbles) {
    List<Integer> circle = new ArrayList<>(Collections.singletonList(0));
    Map<Integer, Long> scores = new HashMap<>();
    int current = 0;
    int elf = 0;

    for (int marble = 1; marble <= marbles; marble++) {
      if (marble % 23 == 0) {
        current = (current + circle.size() - 7) % circle.size();
        scores.put(elf, scores.getOrDefault(elf, 0L) + circle.remove(current) + marble);
      } else {
        current = (current + 2) % circle.size();
        circle.add(current, marble);
      }

      elf = (elf + 1) % players;
    }

    return scores.values().stream()
        .max(Long::compare)
        .orElse(-1L);
  }
}