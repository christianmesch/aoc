package io.christianmesch.aoc19.day12;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class MoonsOfJupiter {

    private final List<String> m = List.of(
            "-6,0,0,0,-15,0,-3,0",
            "-5,0,-3,0,10,0,-8,0",
            "-8,0,-13,0,-11,0,3,0"
    );

    public static void main(String... args) {
        MoonsOfJupiter day = new MoonsOfJupiter();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private int part1() {
        return m.stream()
                .map(this::takeSteps)
                .map(s -> Arrays.stream(s.split(",")).mapToInt(Integer::parseInt).map(Math::abs).toArray())
                .collect(Collector.of(
                        () -> new int[8],
                        (int[] r, int[] a) -> { for(int i = 0; i < r.length; i++) r[i] += a[i]; },
                        (int[] r, int[] a) -> {
                            for(int i = 0; i < r.length; i++) r[i] += a[i];
                            return r;
                        },
                        r -> r[0] * r[1] + r[2] * r[3] + r[4] * r[5] + r[6] * r[7]
                ));
    }

    private long part2() {
        return m.stream()
                .map(this::findCycle)
                .mapToLong(i -> (long) i)
                .reduce(1L, MoonsOfJupiter::lcm);
    }

    private String takeSteps(String previous) {
        for(int i = 0; i < 1000; i++) {
            previous = step(previous);
        }

        return previous;
    }

    private String step(String previous) {
        int[] prev = Arrays.stream(previous.split(",")).mapToInt(Integer::parseInt).toArray();
        int[] curr = new int[8];

        curr[1] = prev[1] - Integer.compare(prev[0], prev[2]) - Integer.compare(prev[0], prev[4]) - Integer.compare(prev[0], prev[6]);
        curr[3] = prev[3] - Integer.compare(prev[2], prev[4]) - Integer.compare(prev[2], prev[6]) - Integer.compare(prev[2], prev[0]);
        curr[5] = prev[5] - Integer.compare(prev[4], prev[6]) - Integer.compare(prev[4], prev[0]) - Integer.compare(prev[4], prev[2]);
        curr[7] = prev[7] - Integer.compare(prev[6], prev[0]) - Integer.compare(prev[6], prev[2]) - Integer.compare(prev[6], prev[4]);

        curr[0] = prev[0] + curr[1];
        curr[2] = prev[2] + curr[3];
        curr[4] = prev[4] + curr[5];
        curr[6] = prev[6] + curr[7];

        return Arrays.stream(curr).mapToObj(String::valueOf).collect(Collectors.joining(","));
    }

    private int findCycle(String previous) {
        Set<String> found = new HashSet<>();

        while(found.add(previous)) {
            previous = step(previous);
        }

        return found.size();
    }

    // lcm shamelessly stolen from https://www.baeldung.com/java-least-common-multiple
    public static long lcm(long number1, long number2) {
        if (number1 == 0 || number2 == 0) {
            return 0L;
        }
        long absNumber1 = Math.abs(number1);
        long absNumber2 = Math.abs(number2);
        long absHigherNumber = Math.max(absNumber1, absNumber2);
        long absLowerNumber = Math.min(absNumber1, absNumber2);
        long lcm = absHigherNumber;
        while (lcm % absLowerNumber != 0) {
            lcm += absHigherNumber;
        }
        return lcm;
    }
}
