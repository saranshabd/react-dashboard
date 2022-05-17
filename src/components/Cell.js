import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import {formatNumber} from '../utils/commonFunctions';

import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {memo} from 'react';
import {animated, useSpring} from 'react-spring';

const Cell = ({statistic, data, getTableStatistic, noDistrictData}) => {
  console.log(data);
  const newData = {};
  newData['total'] = {
    confirmed: data['total']['confirmed'],
    active:
      data['total']['confirmed'] -
      data['total']['recovered'] -
      data['total']['deceased'] -
      data['total']['other'],
    deceased: data['total']['deceased'],
    other: data['total']['other'],
    recovered: data['total']['recovered'],
    tested: data['total']['tested'],
    vaccinated1: data['total']['vaccinated1'],
    vaccinated2: data['total']['vaccinated2'],
    vaccinatedpd: data['total']['vaccinatedpd'],
  };
  newData['delta'] = {
    confirmed: data['delta']['confirmed'],
    active:
      data['delta']['confirmed'] -
      data['delta']['recovered'] -
      data['delta']['deceased'] -
      data['delta']['other'],
    deceased: data['delta']['deceased'],
    other: data['delta']['other'],
    recovered: data['delta']['recovered'],
    tested: data['delta']['tested'],
    vaccinated1: data['delta']['vaccinated1'],
    vaccinated2: data['delta']['vaccinated2'],
    vaccinatedpd: data['delta']['vaccinatedpd'],
  };

  // for (let i = 0; i < timeseries.length; ++i) {
  //   timeseriesDates[timeseries[i]['date']] = {
  //     active: timeseries[i]['total.active'],
  //     positive: timeseries[i]['delta.positive'],
  //     deaths: timeseries[i]['delta.deaths'],
  //     discharged: timeseries[i]['delta.discharged'],
  //     critical: timeseries[i]['active.critical'],
  //     stable_symptomatic: timeseries[i]['active.symptomatic'],
  //     stable_asymptomatic: timeseries[i]['active.asymptomatic'],
  //   };
  // }
  const total = getTableStatistic(newData, statistic, 'total');
  const delta = getTableStatistic(newData, statistic, 'delta');

  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });
  const statisticConfig = STATISTIC_CONFIGS[statistic];

  return (
    <div className="cell statistic">
      {statisticConfig?.showDelta && (
        <animated.div
          className={classnames('delta', `is-${statistic}`)}
          title={delta}
        >
          {statistic === 'active'
            ? formatNumber(newData['delta']['active'])
            : spring.delta.to((delta) =>
                !noDistrictData || !statisticConfig.hasPrimary
                  ? delta > 0
                    ? '\u2191' + formatNumber(delta, statisticConfig.format)
                    : delta < 0
                    ? '\u2193' +
                      formatNumber(Math.abs(delta), statisticConfig.format)
                    : ''
                  : ''
              )}
        </animated.div>
      )}

      <animated.div className="total" title={total}>
        {statistic === 'active'
          ? formatNumber(newData['total']['active'])
          : spring.total.to((total) =>
              !noDistrictData || !statisticConfig.hasPrimary
                ? formatNumber(total, statisticConfig.format, statistic)
                : '-'
            )}
      </animated.div>
    </div>
  );
};

const isCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  } else if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  } else if (
    !equal(prevProps.data?.noDistrictData, currProps.data?.noDistrictData)
  ) {
    return false;
  } else if (!equal(prevProps.getTableStatistic, currProps.getTableStatistic)) {
    return false;
  }
  return true;
};

export default memo(Cell, isCellEqual);
