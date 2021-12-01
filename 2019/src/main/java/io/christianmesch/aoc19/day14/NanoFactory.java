package io.christianmesch.aoc19.day14;

import io.christianmesch.aoc19.utils.InputUtils;

import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class NanoFactory {

    private final Map<Chemical, List<Chemical>> reactions = new HashMap<>();

    public static void main(String... args) throws Exception {
        NanoFactory day = new NanoFactory();

        day.readReactions();

        System.out.println(day.part1());
        System.out.println(day.part2());
    }

    private long part1() {
        List<Chemical> order = retrieveOrder();
        List<Chemical> fuel = new ArrayList<>(reactions.get(new Chemical(0, "FUEL")));

        for (Chemical current : order) {
            fuel = fuel.stream()
                    .map(c -> {
                        if(!c.equals(current) || c.equals(new Chemical(0, "ORE"))) return Collections.singletonList(c);

                        var entry = reactions.entrySet().stream().filter(e -> e.getKey().equals(c)).findFirst().orElseThrow(() -> new NoSuchElementException(c.name));
                        double multi = Math.ceil(c.amount / entry.getKey().amount);

                        return entry.getValue().stream()
                                .map(chem -> new Chemical(chem.amount * multi, chem.name))
                                .collect(Collectors.toList());
                    }).flatMap(List::stream)
                    .collect(Collector.of(
                            HashMap::new,
                            (Map<Chemical, Double> res, Chemical b) -> {
                                double prev = res.getOrDefault(b, 0.0);
                                res.put(b, b.amount + prev);
                            },
                            (Map<Chemical, Double> res, Map<Chemical, Double> b) -> {
                                throw new IllegalArgumentException("");
                            },
                            res -> res.entrySet().stream().map(e -> new Chemical(e.getValue(), e.getKey().name)).collect(Collectors.toList())
                    ));
        }

        return (long) fuel.get(0).amount;
    }

    private long part2() {
        List<Chemical> order = retrieveOrder();
        List<Chemical> fuel = new ArrayList<>(reactions.get(new Chemical(0, "FUEL")));

        for (Chemical current : order) {
            fuel = fuel.stream()
                    .map(c -> {
                        if(!c.equals(current) || c.equals(new Chemical(0, "ORE"))) return Collections.singletonList(c);

                        var entry = reactions.entrySet().stream().filter(e -> e.getKey().equals(c)).findFirst().orElseThrow(() -> new NoSuchElementException(c.name));
                        double multi = c.amount / entry.getKey().amount;

                        return entry.getValue().stream()
                                .map(chem -> new Chemical(chem.amount * multi, chem.name))
                                .collect(Collectors.toList());
                    }).flatMap(List::stream)
                    .collect(Collector.of(
                            HashMap::new,
                            (Map<Chemical, Double> res, Chemical b) -> {
                                double prev = res.getOrDefault(b, 0.0);
                                res.put(b, b.amount + prev);
                            },
                            (Map<Chemical, Double> res, Map<Chemical, Double> b) -> {
                                throw new IllegalArgumentException("");
                            },
                            res -> res.entrySet().stream().map(e -> new Chemical(e.getValue(), e.getKey().name)).collect(Collectors.toList())
                    ));
        }

        return (long) (1000000000000.0 / fuel.get(0).amount) - 1;
    }

    private void readReactions() throws Exception {
        List<String> input = InputUtils.read("/day14.txt");
        for (String line : input) {
            List<Chemical> ingredients = new ArrayList<>();

            String[] a = line.split(" => ");
            String[] b = a[0].split(", ");
            for (String s : b) {
                String[] c = s.split(" ");
                ingredients.add(new Chemical(Long.parseLong(c[0]), c[1]));
            }
            String[] d = a[1].split(" ");
            reactions.put(new Chemical(Long.parseLong(d[0]), d[1]), ingredients);
        }
    }

    private List<Chemical> retrieveOrder() {
        List<Chemical> order = new ArrayList<>();
        order.add(new Chemical(0, "ORE"));

        while (order.size() < reactions.size()) {
            List<Chemical> currentSweep = new ArrayList<>();
            for (var entry : reactions.entrySet()) {
                if (order.containsAll(entry.getValue()) && !order.contains(entry.getKey())) {
                    currentSweep.add(entry.getKey());
                }
            }
            order.addAll(currentSweep);
        }

        Collections.reverse(order);
        return order;
    }

    private static class Chemical {
        public double amount;
        public final String name;

        Chemical(double amount, String name) {
            this.amount = amount;
            this.name = name;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Chemical chemical = (Chemical) o;
            return name.equals(chemical.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
    }
}
