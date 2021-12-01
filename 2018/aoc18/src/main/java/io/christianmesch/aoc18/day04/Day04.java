package io.christianmesch.aoc18.day04;

import io.christianmesch.aoc18.utils.InputUtils;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Day04 {

  private static final String INPUT_FILENAME = "/day4.txt";
  private static final Pattern PATTERN = Pattern.compile("^\\[(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2})] (.+)$");
  private static final Pattern GUARD_PATTERN = Pattern.compile("^Guard #(\\d+) begins shift");

  public static void main(String... args) {
    Day04 day = new Day04();
    try {
      System.out.println(day.part1());
      System.out.println(day.part2());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private long part1() throws Exception {
    Guard found = getGuards().stream()
        .sorted((a, b) -> b.sleepsAt.size() - a.sleepsAt.size())
        .findFirst()
        .orElse(new Guard(-1));

    return found.id * found.getMostFrequentSleepingEntry().getKey();
  }

  private long part2() throws Exception {
    Guard found = getGuards().stream()
        .sorted((a, b) -> b.getMostFrequentSleepingEntry().getValue().intValue() - a.getMostFrequentSleepingEntry().getValue().intValue())
        .findFirst()
        .orElse(new Guard(-1));

    return found.id * found.getMostFrequentSleepingEntry().getKey();
  }

  private List<Guard> getGuards() throws Exception {
    List<LogEntry> logs = InputUtils.read(INPUT_FILENAME).stream()
        .map(PATTERN::matcher)
        .filter(Matcher::matches)
        .map(matcher -> new LogEntry(matcher.group(1), matcher.group(2)))
        .sorted(Comparator.comparing(e -> e.date))
        .collect(Collectors.toList());

    Map<Integer, Guard> guards = new HashMap<>();
    Guard guard = new Guard(-1);
    int startSleep = -1;
    for (LogEntry log : logs) {
      Matcher guardMatcher = GUARD_PATTERN.matcher(log.log);
      if (guardMatcher.matches()) {
        int guardId = Integer.parseInt(guardMatcher.group(1));
        if(!guards.containsKey(guardId)) guards.put(guardId, new Guard(guardId));

        guard = guards.get(guardId);
      } else if (log.log.startsWith("falls")) {
        startSleep = Integer.valueOf(log.date.substring(14, 16));
      } else {
        guard.sleepsAt.addAll(
            IntStream.range(startSleep, Integer.valueOf(log.date.substring(14, 16)))
                .mapToObj(Integer::valueOf)
                .collect(Collectors.toList())
        );
      }
    }

    return guards.values().stream()
        .filter(g -> !g.sleepsAt.isEmpty())
        .collect(Collectors.toList());
  }

  private class Guard {
    public final int id;
    public final List<Integer> sleepsAt = new ArrayList<>();
    public Entry<Integer, Long> mostFrequent = null;

    public Guard(int id) {
      this.id = id;
    }

    public Entry<Integer, Long> getMostFrequentSleepingEntry() {
      if (mostFrequent == null) {
        mostFrequent = sleepsAt.stream()
            .collect(Collectors.groupingBy(t -> t, Collectors.counting()))
            .entrySet().stream()
            .sorted((a, b) -> b.getValue().intValue() - a.getValue().intValue())
            .findFirst()
            .orElseThrow(RuntimeException::new);
      }

      return mostFrequent;
    }
  }

  private class LogEntry {
    public final String date;
    public final String log;

    public LogEntry(String date, String log) {
      this.date = date;
      this.log = log;
    }
  }
}