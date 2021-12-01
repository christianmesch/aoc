package io.christianmesch.aoc19.day01;

import io.christianmesch.aoc19.utils.InputUtils;

public class Fuel {

    private static final String FILE = "/day01.txt";

    public static void main(String... args) {
        Fuel day = new Fuel();

        try {
            System.out.println(day.part1());
            System.out.println(day.part2());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int part1() throws Exception {
        return InputUtils.read(FILE).stream()
                .map(Integer::parseInt)
                .map(mass -> (mass / 3) - 2)
                .reduce(0, Integer::sum);
    }

    private int part2() throws Exception {
        return InputUtils.read(FILE).stream()
                .map(Integer::parseInt)
                .map(this::moduleFuel)
                .reduce(0, Integer::sum);
    }

    private int moduleFuel(int mass) {
        int fuel = (mass / 3) - 2;

        if (fuel <= 0) return 0;
        return fuel + moduleFuel(fuel);
    }
}
