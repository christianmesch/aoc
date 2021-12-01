package io.christianmesch.aoc18.utils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class InputUtils {

  private InputUtils() {}

  public static List<String> read(String filename) throws Exception {
    Path inputPath = Paths.get(InputUtils.class.getResource(filename).toURI());
    return Files.readAllLines(inputPath);
  }
}
