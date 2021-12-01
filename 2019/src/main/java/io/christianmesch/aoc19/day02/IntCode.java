package io.christianmesch.aoc19.day02;

import java.util.stream.Stream;

public class IntCode {

    private static final String INPUT = "1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,19,5,23,2,9,23,27,1,5,27,31,1,5,31,35,1,35,13,39,1,39,9,43,1,5,43,47,1,47,6,51,1,51,13,55,1,55,9,59,1,59,13,63,2,63,13,67,1,67,10,71,1,71,6,75,2,10,75,79,2,10,79,83,1,5,83,87,2,6,87,91,1,91,6,95,1,95,13,99,2,99,13,103,1,103,9,107,1,10,107,111,2,111,13,115,1,10,115,119,1,10,119,123,2,13,123,127,2,6,127,131,1,13,131,135,1,135,2,139,1,139,6,0,99,2,0,14,0";

    public static void main(String... args) {
        IntCode day = new IntCode();

        try {
          System.out.println(day.part1(12, 2));
          System.out.println(day.part2());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private int part1(int n, int v) {
        int[] intcode = Stream.of(INPUT.split(","))
                .mapToInt(Integer::parseInt)
                .toArray();
        intcode[1] = n;
        intcode[2] = v;

        for(int p = 0; p < intcode.length; p = p + 4) {
            switch (intcode[p]) {
                case 1:
                    intcode[intcode[p + 3]] = intcode[intcode[p + 1]] + intcode[intcode[p + 2]];
                    break;
                case 2:
                    intcode[intcode[p + 3]] = intcode[intcode[p + 1]] * intcode[intcode[p + 2]];
                    break;
                case 99:
                    return intcode[0];
                default:
                    throw new IllegalStateException("Something went wrong.");
            }
        }

        return -1;
    }

    private int part2() {
        int output = 19690720;
        for (int n = 0; n < 100; n++) {
            for (int v = 0; v < 100; v++) {
                if (part1(n, v) == output) {
                    return n * 100 + v;
                }
            }
        }

        return -1;
    }


}
