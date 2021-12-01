package io.christianmesch.aoc18.day08;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Day08 {
  private static final String INPUT_FILENAME = "/day8.txt";

  public static void main(String... args) {
    Day08 day = new Day08();
    try {
      System.out.println(day.part1());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private int part1() throws Exception {
    List<Integer> nodes = InputUtils.read(INPUT_FILENAME).stream()
        .flatMap(s -> Stream.of(s.split(" ")))
        .map(Integer::valueOf)
        .collect(Collectors.toList());

    int sum = 0;

    while(!nodes.isEmpty()) {
      sum += getMeta(0, nodes);
    }

    return sum;
  }

  private int getMeta(int i, List<Integer> node) {
    if (i >= node.size()) return 0;

    int subNodes = node.get(i);
    int metas = node.get(i + 1);

    if (subNodes == 0) {
      int sum = node.subList(i + 2, i + 2 + metas).stream().mapToInt(Integer::intValue).sum();
      for (int r = 0; r < 2 + metas; r++) {
        node.remove(i);
      }

      if (i > 0) {
        node.set(i - 2, node.get(i - 2) - 1);
      }

      return sum;
    }

    return getMeta(i + 2, node);
  }
}
