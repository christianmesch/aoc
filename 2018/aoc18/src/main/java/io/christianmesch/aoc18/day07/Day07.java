package io.christianmesch.aoc18.day07;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.PriorityQueue;
import java.util.stream.Collectors;

public class Day07 {
  private static final String INPUT_FILENAME = "/day7.txt";
  private static final List<String> alpha = Arrays.asList(" ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));

  public static void main(String... args) {
    Day07 day = new Day07();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private String part1() throws Exception {
    Map<String, BeforeAfter> nodes = getNodes();

    List<String> first = nodes.entrySet().stream()
        .filter(e -> e.getValue().before.isEmpty())
        .map(Entry::getKey)
        .collect(Collectors.toList());

    List<String> result = new ArrayList<>();
    PriorityQueue<String> possibleWays = new PriorityQueue<>(first);
    while (!possibleWays.isEmpty()) {
      String current = possibleWays.poll();
      BeforeAfter currentBA = nodes.get(current);

      if (result.containsAll(currentBA.before) && !result.contains(current)) {
        result.add(current);
        possibleWays.addAll(currentBA.after);
      }
    }


    return result.stream().reduce("", String::concat);
  }

  private int part2() throws Exception {
    Map<String, BeforeAfter> nodes = getNodes();

    List<String> first = nodes.entrySet().stream()
        .filter(e -> e.getValue().before.isEmpty())
        .map(Entry::getKey)
        .collect(Collectors.toList());

    List<String> result = new ArrayList<>();
    PriorityQueue<String> possibleWays = new PriorityQueue<>(first);
    Map<Integer, LinkedList<String>> finishedAt = new HashMap<>();

    int workers = 5;
    int second = 0;
    for (; !possibleWays.isEmpty() || !finishedAt.isEmpty(); second++) {
      LinkedList<String> finished = finishedAt.getOrDefault(second, new LinkedList<>());
      for (String s : finished) {
        possibleWays.addAll(nodes.get(s).after);
        result.add(s);
      }

      finishedAt.remove(second);
      workers += finished.size();

      while (workers > 0 && !possibleWays.isEmpty()) {
        String current = possibleWays.poll();
        BeforeAfter currentBA = nodes.get(current);

        if (result.containsAll(currentBA.before) && !result.contains(current)) {
          workers--;
          int finishSecond = second + 60 + alpha.indexOf(current);

          LinkedList<String> queue = finishedAt.getOrDefault(finishSecond, new LinkedList<>());
          queue.add(current);
          finishedAt.put(finishSecond, queue);
        }
      }
    }

    return second - 1;
  }

  private Map<String, BeforeAfter> getNodes() throws Exception {
    Map<String, BeforeAfter> nodes = new HashMap<>();
    InputUtils.read(INPUT_FILENAME)
        .forEach(s -> {
          String aKey = s.substring(5, 6);
          String bKey = s.substring(36, 37);

          BeforeAfter a = nodes.getOrDefault(aKey, new BeforeAfter());
          BeforeAfter b = nodes.getOrDefault(bKey, new BeforeAfter());

          a.after.add(bKey);
          b.before.add(aKey);

          nodes.put(aKey, a);
          nodes.put(bKey, b);
        });

    return nodes;
  }

  private class BeforeAfter {
    public List<String> before = new ArrayList<>();
    public List<String> after = new ArrayList<>();
  }
}
