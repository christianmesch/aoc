package io.christianmesch.aoc19.day07;

import io.christianmesch.aoc19.day05.ExtendedIntCode;
import io.christianmesch.aoc19.utils.InputUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.stream.Collectors;

public class AmplifiedThrusters {

    private static final ExtendedIntCode computer = new ExtendedIntCode();
    private static final String PROGRAM = "3,8,1001,8,10,8,105,1,0,0,21,34,55,68,85,106,187,268,349,430,99999,3,9,1001,9,5,9,1002,9,5,9,4,9,99,3,9,1002,9,2,9,1001,9,2,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,101,3,9,9,102,3,9,9,4,9,99,3,9,1002,9,5,9,101,3,9,9,102,5,9,9,4,9,99,3,9,1002,9,4,9,1001,9,2,9,102,3,9,9,101,3,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,99";

    public static void main(String... args) {
        AmplifiedThrusters day = new AmplifiedThrusters();

        try {
            System.out.println(day.part1());
            System.out.println(day.part2());
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private int part1() throws Exception {
        return InputUtils.read("/day07_permutations.txt").stream()
                .map(s -> Arrays.stream(s.split(","))
                        .mapToInt(Integer::parseInt)
                        .reduce(0, (a, b) -> {
                            var input = new LinkedBlockingDeque<Long>();
                            var output = new LinkedBlockingDeque<Long>();
                            try {
                                input.put((long) b);
                                input.put((long) a);
                                return (int) computer.intCodeComputer(PROGRAM, input, output);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }

                            return -1;
                        })
                ).max(Integer::compareTo)
                .orElse(-1);
    }

    private long part2() throws Exception {
        var permutations = InputUtils.read("/day07_permutations_2.txt").stream()
                .map(s -> Arrays.stream(s.split(","))
                        .mapToInt(Integer::parseInt).toArray()
                ).collect(Collectors.toList());

        List<Long> results = new ArrayList<>();

        for (var permutation : permutations) {
            List<Thread> threads = new ArrayList<>();

            var deques = List.of(
                new LinkedBlockingDeque<Long>(),
                new LinkedBlockingDeque<Long>(),
                new LinkedBlockingDeque<Long>(),
                new LinkedBlockingDeque<Long>(),
                new LinkedBlockingDeque<Long>()
            );

            for(int i = 0; i < permutation.length; i++) {
                deques.get(i).putLast((long) permutation[i]);
            }
            deques.get(4).putLast(0L);

            for (int i = 0; i < permutation.length; i++) {
                final int inputIndex = (4 + i) % 5;
                final int outputIndex = i;

                Thread amp = new Thread(() -> {
                    var ampComputer = new ExtendedIntCode();
                    try {
                        ampComputer.intCodeComputer(PROGRAM, deques.get(inputIndex), deques.get(outputIndex));
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                });

                threads.add(amp);
                amp.start();
            }

            threads.get(4).join();
            results.add(deques.get(4).peekLast());
        }

        return results.stream().max(Long::compareTo).orElse(-1L);
    }
}
