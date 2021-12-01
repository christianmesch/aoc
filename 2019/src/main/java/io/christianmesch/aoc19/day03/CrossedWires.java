package io.christianmesch.aoc19.day03;

import io.christianmesch.aoc19.utils.InputUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CrossedWires {
    
    private static List<Coordinate> wire1;
    private static List<Coordinate> wire2;

    public static void main(String... args) {
        CrossedWires day = new CrossedWires();

        try {
            List<String> lines = InputUtils.read("/day03.txt");
            wire1 = day.getCoordinates(lines.get(0));
            wire2 = day.getCoordinates(lines.get(1));

            System.out.println(day.part1());
            System.out.println(day.part2());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int part1() {
        return getIntersections()
                .stream()
                .map(c -> Math.abs(c.x) + Math.abs(c.y))
                .min(Integer::compareTo)
                .orElseThrow(IllegalStateException::new);
    }

    private int part2() {
        return getIntersections().stream()
                .map(i -> wire1.indexOf(i) + wire2.indexOf(i) + 2)
                .min(Integer::compareTo)
                .orElseThrow(IllegalStateException::new);
    }

    private List<Coordinate> getIntersections() {
        return Stream.concat(wire1.stream().distinct(), wire2.stream().distinct())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
                .entrySet()
                .stream()
                .filter(e -> e.getValue() > 1)
                .map(Map.Entry::getKey)
                .collect(Collectors.toUnmodifiableList());
    }

    private List<Coordinate> getCoordinates(String line) {
        int x = 0;
        int y = 0;
        List<Coordinate> coordinates = new ArrayList<>();

        for (String op : line.split(",")) {
            int steps = Integer.parseInt(op.substring(1));
            switch(op.charAt(0)) {
                case 'U':
                    for(int i = 0; i < steps; i++) {
                        coordinates.add(new Coordinate(x, ++y));
                    }
                    break;
                case 'D':
                    for(int i = 0; i < steps; i++) {
                        coordinates.add(new Coordinate(x, --y));
                    }
                    break;
                case 'R':
                    for(int i = 0; i < steps; i++) {
                        coordinates.add(new Coordinate(++x, y));
                    }
                    break;
                case 'L':
                    for(int i = 0; i < steps; i++) {
                        coordinates.add(new Coordinate(--x, y));
                    }
                    break;
                default:
                    throw new IllegalStateException("Something went wrong.");
            }
        }

        return Collections.unmodifiableList(coordinates);
    }

    private static class Coordinate {

        final int x;
        final int y;

        Coordinate(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Coordinate that = (Coordinate) o;
            return x == that.x &&
                    y == that.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }
}
