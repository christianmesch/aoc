#!/bin/sh

DAYS=( 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 )

STARTALL=$(date +%s.%N)
for day in "${DAYS[@]}"
do
    echo "Day $day"
    START=$(date +%s.%N)
    RES=$(node $day.js inputs/$day.txt)
    END=$(date +%s.%N)
    DIFF=$( echo "$END - $START" | bc -l )

    echo "Part 1 | ${RES} | ${DIFF}"

    START=$(date +%s.%N)
    RES=$(node $day.js inputs/$day.txt 2)
    END=$(date +%s.%N)
    DIFF=$( echo "$END - $START" | bc -l )

    echo "Part 2 | ${RES} | ${DIFF}"
done
ENDALL=$(date +%s.%N)
DIFFALL=$( echo "$ENDALL - $STARTALL" | bc -l )

echo "Total time: ${DIFFALL}"