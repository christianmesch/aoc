
package io.christianmesch.aoc19.day05;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.stream.Stream;

public class ExtendedIntCode {

    private static final String PROGRAM = "3,225,1,225,6,6,1100,1,238,225,104,0,1001,92,74,224,1001,224,-85,224,4,224,1002,223,8,223,101,1,224,224,1,223,224,223,1101,14,63,225,102,19,83,224,101,-760,224,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1101,21,23,224,1001,224,-44,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,1102,40,16,225,1102,6,15,225,1101,84,11,225,1102,22,25,225,2,35,96,224,1001,224,-350,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,1101,56,43,225,101,11,192,224,1001,224,-37,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1002,122,61,224,1001,224,-2623,224,4,224,1002,223,8,223,101,7,224,224,1,223,224,223,1,195,87,224,1001,224,-12,224,4,224,1002,223,8,223,101,5,224,224,1,223,224,223,1101,75,26,225,1101,6,20,225,1102,26,60,224,101,-1560,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,108,677,226,224,102,2,223,223,1006,224,329,1001,223,1,223,1108,226,677,224,1002,223,2,223,1006,224,344,101,1,223,223,7,226,677,224,102,2,223,223,1006,224,359,1001,223,1,223,1007,226,677,224,1002,223,2,223,1006,224,374,1001,223,1,223,1108,677,226,224,102,2,223,223,1005,224,389,1001,223,1,223,107,226,226,224,102,2,223,223,1006,224,404,101,1,223,223,1107,226,226,224,1002,223,2,223,1005,224,419,1001,223,1,223,1007,677,677,224,102,2,223,223,1006,224,434,101,1,223,223,1107,226,677,224,1002,223,2,223,1006,224,449,101,1,223,223,107,677,677,224,102,2,223,223,1005,224,464,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,479,101,1,223,223,1007,226,226,224,102,2,223,223,1005,224,494,1001,223,1,223,8,677,226,224,1002,223,2,223,1005,224,509,1001,223,1,223,108,677,677,224,1002,223,2,223,1005,224,524,1001,223,1,223,1008,677,677,224,102,2,223,223,1006,224,539,1001,223,1,223,7,677,226,224,1002,223,2,223,1005,224,554,101,1,223,223,1108,226,226,224,1002,223,2,223,1005,224,569,101,1,223,223,107,677,226,224,102,2,223,223,1005,224,584,101,1,223,223,8,226,226,224,1002,223,2,223,1005,224,599,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,614,1001,223,1,223,7,226,226,224,102,2,223,223,1006,224,629,1001,223,1,223,1107,677,226,224,102,2,223,223,1005,224,644,101,1,223,223,8,226,677,224,102,2,223,223,1006,224,659,1001,223,1,223,1008,226,677,224,1002,223,2,223,1006,224,674,1001,223,1,223,4,223,99,226";

    private long mode = 0;

    public static void main(String... args) {
        ExtendedIntCode day = new ExtendedIntCode();

        try {
            var part1Input = new LinkedBlockingDeque<Long>();
            part1Input.putLast(1L);
            var part1Output = new LinkedBlockingDeque<Long>();
            System.out.println(day.intCodeComputer(PROGRAM, part1Input, part1Output));

            var part2Input = new LinkedBlockingDeque<Long>();
            part2Input.putLast(5L);
            var part2Output = new LinkedBlockingDeque<Long>();
            System.out.println(day.intCodeComputer(PROGRAM, part2Input, part2Output));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public long intCodeComputer(String program, BlockingDeque<Long> input, BlockingDeque<Long> output) throws InterruptedException {
        long[] memory = Stream.of(program.split(","))
                .mapToLong(Long::parseLong)
                .toArray();

        final Map<Long, Long> extraMemory = new HashMap<>();

        long lastOutput = -1;
        long relativeBase = 0;

        for(long p = 0; p < memory.length;) {
            int opcode = (int) memory[(int) p] % 100;
            mode = memory[(int) p] / 100;

            switch (opcode) {
                case 1:
                    set(memory, extraMemory, p + 3, relativeBase, get(memory, extraMemory, p + 1, relativeBase) + get(memory, extraMemory, p + 2, relativeBase));
                    p += 4;
                    break;
                case 2:
                    set(memory, extraMemory, p + 3, relativeBase, get(memory, extraMemory, p + 1, relativeBase) * get(memory, extraMemory, p + 2, relativeBase));
                    p += 4;
                    break;
                case 3:
                    set(memory, extraMemory, p + 1, relativeBase, input.takeFirst());
                    p += 2;
                    break;
                case 4:
                    lastOutput = get(memory, extraMemory, p + 1, relativeBase);
                    output.putLast(lastOutput);
                    p += 2;
                    break;
                case 5:
                    p = get(memory, extraMemory, p + 1, relativeBase) != 0 ? get(memory, extraMemory, p + 2, relativeBase) : p + 3;
                    break;
                case 6:
                    p = get(memory, extraMemory, p + 1, relativeBase) == 0 ? get(memory, extraMemory, p + 2, relativeBase) : p + 3;
                    break;
                case 7:
                    set(memory, extraMemory, p + 3, relativeBase, get(memory, extraMemory, p + 1, relativeBase) < get(memory, extraMemory, p + 2, relativeBase) ? 1 : 0);
                    p += 4;
                    break;
                case 8:
                    set(memory, extraMemory, p + 3, relativeBase, get(memory, extraMemory, p + 1, relativeBase) == get(memory, extraMemory, p + 2, relativeBase) ? 1 : 0);
                    p += 4;
                    break;
                case 9:
                    relativeBase += get(memory, extraMemory, p + 1, relativeBase);
                    p += 2;
                    break;
                case 99:
                    return lastOutput;
                default:
                    throw new IllegalArgumentException("Unknown opcode. Got: " + opcode);
            }
        }

        return -1;
    }

    private long get(long[] memory, Map<Long, Long> extraMemory, long p, long relativeBase) {
        long value = switch((int) mode % 10) {
            case 0 -> {
                long position = memory[(int) p];
                if (position < memory.length) {
                    yield memory[(int) position];
                }

                yield extraMemory.getOrDefault(position, 0L);
            }
            case 1 -> memory[(int) p];
            case 2 -> {
                long position = relativeBase + memory[(int) p];
                if(position < memory.length) {
                    yield memory[(int) position];
                }

                yield extraMemory.getOrDefault(position, 0L);
            }
            default -> throw new IllegalArgumentException("Unknown mode: " + mode % 10);
        };

        mode /= 10;
        return value;
    }

    private void set(long[] memory, Map<Long, Long> extraMemory, long p, long relativeBase, long val) {
        long position = switch ((int) mode % 10) {
            case 0 -> memory[(int) p];
            case 2 -> relativeBase + memory[(int) p];
            default -> throw new IllegalArgumentException("Unknown mode for set: " + mode % 10);
        };

        if (position < memory.length) {
            memory[(int) position] = val;
        } else {
            extraMemory.put(position, val);
        }
    }
}