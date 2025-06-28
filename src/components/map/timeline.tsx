import * as React from "react";
import Slider from "@mui/material/Slider";
import { usePositionContext } from "@chronistic/providers/position-store-provider";
import duration, { Duration } from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import pluralize from "pluralize";

function valuetext(value: number) {
  return dayjs.duration(value, "seconds").humanize();
}

export default function Timeline() {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  const defaultMaxDuration = dayjs.duration(1, "weeks");
  const markUnits = "days";
  const majorTickLabel = (value: number) => {
    return `${value} ${pluralize("Day", value)}`;
  };

  const [tempValue, setTempValue] = React.useState(0);
  const maxTime = usePositionContext((state) => {
    if (state.positions.length === 0) {
      return defaultMaxDuration.asSeconds();
    } else {
      const maxInterval = state.positions.reduce(function (prev, current) {
        return prev &&
          prev.intervalFromBeginning > current.intervalFromBeginning
          ? prev
          : current;
      });
      return maxInterval.intervalFromBeginning > defaultMaxDuration
        ? maxInterval.intervalFromBeginning.asSeconds()
        : defaultMaxDuration.asSeconds();
    }
  });
  const timelinePosition = usePositionContext((state) =>
    state.timelinePosition.asSeconds(),
  );
  const setTimelinePosition = usePositionContext(
    (state) => state.setTimelinePosition,
  );

  // Generate marks based on the units you'd like
  const marks = Array.from(
    { length: Math.ceil(maxTime / dayjs.duration(1, markUnits).asSeconds()) },
    (_, index) => {
      const value = dayjs.duration(index, markUnits).asSeconds();
      const dayNumber = index;
      return {
        value: value,
        label: majorTickLabel(dayNumber),
      };
    },
  );

  const handleChange = (event: Event, newValue: number) => {
    setTempValue(newValue as number);
    setTimelinePosition(dayjs.duration(newValue, "seconds"));
    console.log("Slider value changed:", newValue);
  };

  const formatValueLabel = (value: number) => {
    return dayjs.duration(value, "seconds").format("HH:mm:ss Y-M-D");
  };

  return (
    <div className="box-border flex w-full flex-col">
      <div className="mb-0 box-border flex w-full justify-center">
        <span className="mx-1 w-8 text-2xl font-bold tracking-wide text-white">
          Day
        </span>
        <div className="mx-12 max-w-full flex-1">
          <Slider
            aria-label="Always visible"
            defaultValue={0}
            value={tempValue}
            getAriaValueText={valuetext}
            onChange={handleChange}
            step={10}
            marks={marks}
            max={maxTime}
            valueLabelDisplay="on"
            valueLabelFormat={formatValueLabel}
          />
        </div>
      </div>
    </div>
  );
}
