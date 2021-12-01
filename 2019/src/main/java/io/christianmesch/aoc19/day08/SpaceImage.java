package io.christianmesch.aoc19.day08;

import io.christianmesch.aoc19.utils.InputUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class SpaceImage {

    private static final int X = 25;
    private static final int Y = 6;

    public static void main(String... args) {
        SpaceImage day = new SpaceImage();
        try {
            int[] data = Arrays.stream(InputUtils.read("/day08.txt").get(0).split("")).mapToInt(Integer::parseInt).toArray();
            List<int[]> layers = new ArrayList<>();
            for (int i = 0; i < data.length; i += X * Y) {
                layers.add(Arrays.copyOfRange(data, i, i + X * Y));
            }

            System.out.println(day.part1(layers));
            day.part2(layers);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private long part1(List<int[]> layers) {
        return IntStream.range(0, layers.size())
                .boxed()
                .collect(Collectors.toMap(i -> i, i -> Arrays.stream(layers.get(i)).filter(num -> num == 0).count()))
                .entrySet().stream()
                .min(Comparator.comparing(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .map(layer -> Arrays.stream(layers.get(layer))
                        .filter(i -> i == 1)
                        .count()
                        *
                        Arrays.stream(layers.get(layer))
                                .filter(i -> i == 2)
                                .count())
                .orElse(-1L);
    }

    private void part2(List<int[]> layers) {
        int[] result = Arrays.copyOf(layers.get(0), layers.get(0).length);

        for (int i = 1; i < layers.size(); i++) {
            int[] layer = layers.get(i);
            for (int j = 0; j < layer.length; j++) {
                if (result[j] == 2) result[j] = layer[j];
            }
        }

        for(int i = 0; i < result.length; i += X) {
            Arrays.stream(Arrays.copyOfRange(result, i, i + X)).forEach(p -> System.out.print(p == 1 ? "#" : " "));
            System.out.println();
        }
    }
}
