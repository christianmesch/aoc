package io.christianmesch.aoc19.day10;

import java.util.*;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

public class MonitoringStation {

    private static final String[] MAP = "..#..###....#####....###........#.##.##...#.#.......#......##....##..#..##.#..###...##....#......##..####...#..##...####.#.......#.#...#.#.....##...#.####.#.###.#..##..#..##.#.#.####.#.###.#.##.....#.##...##.....##.#......#.....##..#..##.##.#..#....#...#...#...##..#..#.....###.#..##.###.##........##...#..#####.#.#......####.......##.#.#.#.###..#...#.#..##.#.........#....#....##.####....#.......#..##.#.........#..#......###..##.##....#.#..#.#....#.###...#.....##...##..#.#.#...###..#.#.#..###.#..##..##...##...#.#.#...#..#.#..#..#..##.##...###.##.#......#......#.....###.....#....#..#....#...#...###..#......#.##.#...#.####.....#.##...##.#...#........#.#.....#.##....#..#.......##.##.....#..#.#....###.#.#.#.#.#............#....####.##....#..###.##.#.#..#.......##....#.#.#...#...#..#........#.#..####.##.#.........###..##.......#....#.##.......#.#.###......#..#.#.........#...###......#..#.##.#.#.#.#........#.#.##..#..........#.##.#...........#..#.#....####....##..#..##.#.##.##..##....#.#..###.#..#...#....#.###.#..#.............#...#...#.......#.#...........###.#.....#..##..#.##...".split("");
    private static final int WIDTH = 33;

    private final Map<Integer, Map<Double, List<Integer>>> stationAngles = new HashMap<>();

    public static void main(String... args) {
        MonitoringStation day = new MonitoringStation();
        day.calculateAngles();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private int part1() {
        return stationAngles.values().stream()
                .map(a -> a.keySet().size())
                .max(Integer::compareTo)
                .orElse(-1);
    }

    private int part2() {
        final int station = stationAngles.entrySet().stream()
                .max(Comparator.comparingInt(e -> e.getValue().keySet().size()))
                .map(Map.Entry::getKey)
                .orElse(-1);

        var asteroids = stationAngles.get(station).entrySet().stream()
                .map(e -> Map.entry(e.getKey() > Math.PI / 2 ? (e.getKey() - 2 * Math.PI) : e.getKey(), e.getValue()))
                .sorted(Comparator.comparingDouble((ToDoubleFunction<Map.Entry<Double, List<Integer>>>) Map.Entry::getKey).reversed())
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());

        Integer index = asteroids.get(199).stream()
                .min((a, b) -> {
                    int aX = (a % WIDTH) - (station % WIDTH);
                    int aY = (a / WIDTH) - (station / WIDTH);

                    int bX = (b % WIDTH) - (station % WIDTH);
                    int bY = (b / WIDTH) - (station / WIDTH);

                    return Integer.compare(Math.abs(aX) + Math.abs(aY), Math.abs(bX) + Math.abs(bY));
                }).orElse(-1);

        return (index % WIDTH) * 100 + (index / WIDTH);
    }

    private void calculateAngles() {
        for (int station = 0; station < MAP.length; station++) {
            if (MAP[station].equals(".")) continue;

            Map<Double, List<Integer>> angles = new HashMap<>();
            for (int asteroid = 0; asteroid < MAP.length; asteroid++) {
                if (asteroid == station || MAP[asteroid].equals(".")) continue;

                int relativeX = (asteroid % WIDTH) - (station % WIDTH);
                int relativeY = (asteroid / WIDTH) - (station / WIDTH);
                double angle = Math.atan2(-relativeY, relativeX);

                var asteroidAngle = angles.getOrDefault(angle, new ArrayList<>());
                asteroidAngle.add(asteroid);

                angles.put(angle, asteroidAngle);
            }

            stationAngles.put(station, angles);
        }
    }
}
