import {
  MINIGRAPH_LOOKBACK_DAYS,
  LEVEL_STATISTICS,
  MUMBAI_LEVEL_STATISTICS,
  STATISTIC_CONFIGS,
} from '../constants';
import {
  getStatistic,
  getIndiaDateYesterdayISO,
  parseIndiaDate,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {max} from 'd3-array';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
import 'd3-transition';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useCallback, useEffect, useRef, useMemo} from 'react';
import {useMeasure} from 'react-use';

// Dimensions
const margin = {top: 10, right: 10, bottom: 2, left: 10};
const height = 75;
const maxWidth = 120;

function Minigraphs({timeseries, date: timelineDate, isMumbai = false, test}) {
  // console.log(timeseries);
  // console.log(timeseries);
  // console.log(isMumbai);
  const levelStatistics = isMumbai ? MUMBAI_LEVEL_STATISTICS : LEVEL_STATISTICS;

  const refs = useRef([]);
  const endDate = timelineDate || getIndiaDateYesterdayISO();

  let [wrapperRef, {width}] = useMeasure();
  width = Math.min(width, maxWidth);

  const dates = useMemo(() => {
    const pastDates = Object.keys(timeseries || {}).filter(
      (date) => date <= endDate
    );
    const lastDate = pastDates[pastDates.length - 1];

    const cutOffDateLower = formatISO(
      subDays(parseIndiaDate(lastDate), MINIGRAPH_LOOKBACK_DAYS),
      {representation: 'date'}
    );
    return pastDates.filter((date) => date >= cutOffDateLower);
  }, [endDate, timeseries]);

  const getMinigraphStatistic = useCallback(
    (date, statistic) => {
      return getStatistic(
        timeseries?.[date],
        'delta',
        statistic,
        isMumbai,
        test
      );
    },
    [timeseries]
  );

  // console.log(getMinigraphStatistic);

  useEffect(() => {
    if (!width) return;

    const T = dates.length;

    const chartRight = width - margin.right;
    const chartBottom = height - margin.bottom;

    const xScale = scaleTime()
      .clamp(true)
      .domain([
        parseIndiaDate(dates[0] || endDate),
        parseIndiaDate(dates[T - 1]) || endDate,
      ])
      .range([margin.left, chartRight]);

    refs.current.forEach((ref, index) => {
      const svg = select(ref);
      const statistic = levelStatistics[index];
      const color = STATISTIC_CONFIGS[statistic].color;

      const dailyMaxAbs = max(dates, (date) =>
        Math.abs(getMinigraphStatistic(date, statistic))
      );

      const yScale = scaleLinear()
        .clamp(true)
        .domain([-dailyMaxAbs, dailyMaxAbs])
        .range([chartBottom, margin.top]);

      const linePath = line()
        .curve(curveMonotoneX)
        .x((date) => xScale(parseIndiaDate(date)))
        .y((date) => yScale(getMinigraphStatistic(date, statistic)));

      let pathLength;
      svg
        .selectAll('path')
        .data(T ? [dates] : [])
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('fill', 'none')
              .attr('stroke', color + '99')
              .attr('stroke-width', 2.5)
              .attr('d', linePath)
              .attr('stroke-dasharray', function () {
                return (pathLength = this.getTotalLength());
              })
              .call((enter) =>
                enter
                  .attr('stroke-dashoffset', pathLength)
                  .transition()
                  .delay(100)
                  .duration(2500)
                  .attr('stroke-dashoffset', 0)
              ),
          (update) =>
            update
              .attr('stroke-dasharray', null)
              .transition()
              .duration(500)
              .attrTween('d', function (date) {
                const previous = select(this).attr('d');
                const current = linePath(date);
                return interpolatePath(previous, current);
              })
              .selection()
        );

      svg
        .selectAll('circle')
        .data(T ? [dates[T - 1]] : [])
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr('fill', color)
              .attr('r', 2.5)
              .attr('cx', (date) => xScale(parseIndiaDate(date)))
              .attr('cy', (date) =>
                yScale(getMinigraphStatistic(date, statistic))
              )
              .style('opacity', 0)
              .call((enter) =>
                enter
                  .transition()
                  .delay(2100)
                  .duration(500)
                  .style('opacity', 1)
                  .attr('cx', (date) => xScale(parseIndiaDate(date)))
                  .attr('cy', (date) =>
                    yScale(getMinigraphStatistic(date, statistic))
                  )
              ),
          (update) =>
            update
              .transition()
              .duration(500)
              .attr('cx', (date) => xScale(parseIndiaDate(date)))
              .attr('cy', (date) =>
                yScale(getMinigraphStatistic(date, statistic))
              )
              .style('opacity', 1)
              .selection()
        );
    });
  }, [endDate, dates, width, getMinigraphStatistic]);

  // console.log(levelStatistics);

  return (
    <div className="Minigraph">
      {levelStatistics.map((statistic, index) => (
        <div
          key={statistic}
          className={classnames('svg-parent')}
          ref={index === 0 ? wrapperRef : null}
          style={{width: `calc(${100 / levelStatistics.length}%)`}}
        >
          <svg
            ref={(el) => {
              refs.current[index] = el;
            }}
            preserveAspectRatio="xMidYMid meet"
            width={width}
            height={height}
          />
        </div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (currProps.forceRender) {
    return false;
  } else if (!currProps.timeseries && prevProps.timeseries) {
    return true;
  } else if (currProps.timeseries && !prevProps.timeseries) {
    return false;
  } else if (!equal(currProps.stateCode, prevProps.stateCode)) {
    return false;
  } else if (!equal(currProps.date, prevProps.date)) {
    return false;
  } else if (currProps.isMumbai !== prevProps.isMumbai) {
    return false;
  }
  return true;
};

export default memo(Minigraphs, isEqual);
