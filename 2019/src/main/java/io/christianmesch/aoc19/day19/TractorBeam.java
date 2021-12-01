package io.christianmesch.aoc19.day19;

import io.christianmesch.aoc19.day05.ExtendedIntCode;

import java.util.Arrays;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

public class TractorBeam {

    private static final String PROGRAM = "109,424,203,1,21101,11,0,0,1105,1,282,21102,1,18,0,1105,1,259,1201,1,0,221,203,1,21102,31,1,0,1106,0,282,21101,38,0,0,1106,0,259,21001,23,0,2,22102,1,1,3,21101,0,1,1,21102,57,1,0,1106,0,303,1202,1,1,222,20102,1,221,3,21002,221,1,2,21101,259,0,1,21102,80,1,0,1106,0,225,21101,0,51,2,21101,0,91,0,1106,0,303,1202,1,1,223,20101,0,222,4,21101,259,0,3,21102,225,1,2,21101,225,0,1,21101,118,0,0,1105,1,225,20102,1,222,3,21102,1,152,2,21102,133,1,0,1105,1,303,21202,1,-1,1,22001,223,1,1,21102,1,148,0,1105,1,259,1202,1,1,223,20101,0,221,4,21002,222,1,3,21102,1,17,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,195,0,0,105,1,108,20207,1,223,2,21002,23,1,1,21102,1,-1,3,21102,214,1,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1202,-4,1,249,22101,0,-3,1,21202,-2,1,2,22102,1,-1,3,21101,250,0,0,1106,0,225,22101,0,1,-4,109,-5,2105,1,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,22101,0,-2,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21201,-2,0,3,21102,1,343,0,1105,1,303,1106,0,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,21202,-4,1,1,21102,1,384,0,1105,1,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,22102,1,1,-4,109,-5,2105,1,0";

    private final BlockingDeque<Long> input = new LinkedBlockingDeque<>();
    private final BlockingDeque<Long> output = new LinkedBlockingDeque<>();
    private final Runnable drone = () -> {
        ExtendedIntCode computer = new ExtendedIntCode();
        try {
            computer.intCodeComputer(PROGRAM, input, output);
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    private final long[] b = new long[50 * 50];

    public static void main(String... args) throws InterruptedException {
        TractorBeam day = new TractorBeam();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private long part1() throws InterruptedException {
        for (int x = 0; x < 50; x++) {
            for (int y = 0; y < 50; y++) {
                new Thread(drone).start();
                input.putLast((long) x);
                input.putLast((long) y);
                Long o = output.pollFirst(500, TimeUnit.MILLISECONDS);
                if (o == null) break;
                b[y * 50 + x] = o;
            }
        }

        return Arrays.stream(b).filter(l -> l == 1).count();
    }

    private int part2() throws InterruptedException {
        int y = 800;
        int x = 0;
        while(true) {
            x = leftMostBeam(y, y);
            if (has100(x, y - 99)) {
                break;
            }
            y++;
        }

        return x * 10000 + (y - 99);
    }

    private int leftMostBeam(int startX, int y) throws InterruptedException {
        for (int x = startX; ; x++) {
            new Thread(drone).start();
            input.putLast((long) x);
            input.putLast((long) y);
            Long o = output.pollFirst(500, TimeUnit.MILLISECONDS);
            if (o == null) break;
            if (o.equals(1L)) return x;
        }

        return -1;
    }

    private boolean has100(int startX, int y) throws InterruptedException {
        for(int x = startX; x < startX + 100; x++) {
            new Thread(drone).start();
            input.putLast((long) x);
            input.putLast((long) y);
            Long o = output.pollFirst(500, TimeUnit.MILLISECONDS);
            if (o == null || o.equals(0L)) return false;
        }

        return true;
    }

    private void print() {
        for(int y = 0; y < 50; y++) {
            for(int x = 0; x < 50; x++) {
                System.out.print(b[y * 50 + x] == 1 ? "#" : ".");
            }
            System.out.println("");
        }
    }
}
