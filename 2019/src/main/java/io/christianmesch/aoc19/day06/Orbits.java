package io.christianmesch.aoc19.day06;

import io.christianmesch.aoc19.utils.InputUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Orbits {

    private final Map<String, List<String>> orbits = new HashMap<>();

    public static void main(String... args) {
        Orbits day = new Orbits();

        try {
            InputUtils.read("/day06.txt").stream()
                    .map(o -> o.split("\\)"))
                    .forEach(o -> {
                        var orbiters = day.orbits.getOrDefault(o[0], new ArrayList<>());
                        orbiters.add(o[1]);
                        day.orbits.put(o[0], orbiters);
                    });

            System.out.println(day.part1());
            System.out.println(day.part2());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int part1() {
        return orbits.keySet().stream()
                .map(this::getNumOrbits)
                .reduce(0, Integer::sum);
    }

    private long part2() {
        return Stream.concat(findDependencyLine("YOU").stream(), findDependencyLine("SAN").stream())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()))
                .entrySet()
                .stream()
                .filter(e -> e.getValue() == 1)
                .count();
    }

    private int getNumOrbits(String obj) {
        List<String> objects = orbits.getOrDefault(obj, Collections.emptyList());
        return objects.stream()
                .map(this::getNumOrbits)
                .reduce(objects.size(), Integer::sum);
    }

    private Optional<String> findOrbitsObject(String obj) {
        return orbits.entrySet().stream()
                .filter(e -> e.getValue().contains(obj))
                .findFirst()
                .map(Map.Entry::getKey);
    }

    private List<String> findDependencyLine(String obj) {
        return findOrbitsObject(obj).map(o -> {
            List<String> line = new ArrayList<>(findDependencyLine(o));
            line.add(o);
            return line;
        }).orElse(Collections.emptyList());
    }
}
