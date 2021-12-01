package io.christianmesch.aoc19.day16;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class FlawedFrequencyTransmission {

    private static final String INPUT = "59793513516782374825915243993822865203688298721919339628274587775705006728427921751430533510981343323758576985437451867752936052153192753660463974146842169169504066730474876587016668826124639010922391218906707376662919204980583671961374243713362170277231101686574078221791965458164785925384486127508173239563372833776841606271237694768938831709136453354321708319835083666223956618272981294631469954624760620412170069396383335680428214399523030064601263676270903213996956414287336234682903859823675958155009987384202594409175930384736760416642456784909043049471828143167853096088824339425988907292558707480725410676823614387254696304038713756368483311";

    private static final int[] BASE_PATTERN = new int[]{0, 1, 0, -1};

    public static void main(String... args) {
        FlawedFrequencyTransmission day = new FlawedFrequencyTransmission();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private String part1() {
        int[] output = Arrays.stream(INPUT.split("")).mapToInt(Integer::parseInt).toArray();
        for (int i = 0; i < 100; i++) {
            output = phase(output);
        }

        int[] result = Arrays.copyOfRange(output, 0, 8);
        return IntStream.range(0, 8)
                .mapToObj(i -> String.valueOf(result[i]))
                .collect(Collectors.joining(""));
    }

    private String part2() {
        int[] tmp = Arrays.stream(INPUT.repeat(10000).split("")).mapToInt(Integer::parseInt).toArray();
        int offset = Integer.parseInt(INPUT.substring(0, 7));
        int[] output = Arrays.copyOfRange(tmp, offset, tmp.length);

        for (int i = 0; i < 100; i++) {
            output = phase2(output);
        }

        int[] result = Arrays.copyOfRange(output, 0, 8);
        return IntStream.range(0, 8)
                .mapToObj(i -> String.valueOf(result[i]))
                .collect(Collectors.joining(""));
    }

    private int[] phase(int[] input) {
        int[] output = new int[input.length];

        for (int i = 0; i < output.length; i++) {
            int[] pattern = createPattern(i);
            int sum = 0;

            for (int j = 0; j < input.length; j++) {
                sum += input[j] * pattern[j % pattern.length];
            }

            output[i] = Math.abs(sum % 10);
        }

        return output;
    }

    private int[] phase2(int[] input) {
        int[] output = new int[input.length];
        int sum = 0;

        for (int i = output.length - 1; i >= 0; i--) {
            sum += input[i];
            output[i] = Math.abs(sum % 10);
        }

        return output;
    }

    private int[] createPattern(int i) {
        int[] pattern = new int[(i + 1) * BASE_PATTERN.length + 1];

        int idx = 0;
        for (int value : BASE_PATTERN) {
            for (int k = 0; k < (i + 1); k++) {
                pattern[idx] = value;
                idx++;
            }
        }

        return Arrays.copyOfRange(pattern, 1, pattern.length);
    }
}
