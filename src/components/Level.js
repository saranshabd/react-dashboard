import {
  LEVEL_STATISTICS,
  MUMBAI_LEVEL_STATISTICS,
  STATISTIC_CONFIGS,
  SPRING_CONFIG_NUMBERS,
} from '../constants';
import {capitalize, formatNumber, getStatistic} from '../utils/commonFunctions';

import {HeartFillIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';

function PureLevelItem({
  statistic,
  total,
  delta,
  totalActive,
  totalCritical,
  totalStableSymptomatic,
  totalStableAsymptomatic,
  totalDeaths,
  fromState,
}) {
  const {t} = useTranslation();
  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });

  const statisticConfig = STATISTIC_CONFIGS[statistic];
  function numberWithCommas(x) {
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return res;
  }

  return (
    <>
      <h5>{t(capitalize(statisticConfig.displayName))}</h5>
      <animated.h4>
        {statistic !== 'active' ? (
          delta > 0 ? (
            /* Add space after + because react-spring regex bug */
            spring.delta.to(
              (delta) =>
                `+ ${formatNumber(
                  delta,
                  statisticConfig.format !== 'short'
                    ? statisticConfig.format
                    : 'long',
                  statistic
                )}`
            )
          ) : (
            <HeartFillIcon size={9} verticalAlign={2} />
          )
        ) : (
          '\u00A0'
        )}
      </animated.h4>
      <animated.h1>
        {fromState
          ? statisticConfig.displayName == 'active'
            ? numberWithCommas(totalActive)
            : statisticConfig.displayName == 'critical'
            ? numberWithCommas(totalCritical)
            : statisticConfig.displayName == 'stable symptomatic'
            ? numberWithCommas(totalStableSymptomatic)
            : statisticConfig.displayName == 'stable asymptomatic'
            ? numberWithCommas(totalStableAsymptomatic)
            : numberWithCommas(totalDeaths)
          : statisticConfig.displayName == 'active'
          ? numberWithCommas(totalActive)
          : spring.total.to((total) =>
              formatNumber(
                total,
                statisticConfig.format !== 'short'
                  ? statisticConfig.format
                  : 'long',
                statistic
              )
            )}
      </animated.h1>
    </>
  );
}

const LevelItem = memo(PureLevelItem);

function Level({
  data,
  isMumbai = false,
  totalActive,
  totalCritical,
  totalStableSymptomatic,
  totalStableAsymptomatic,
  totalDeaths,
  fromState,
}) {
  if (!totalActive) {
    totalActive =
      data['total']['confirmed'] -
      data['total']['recovered'] -
      data['total']['deceased'] -
      data['total']['other'];
  }
  const levelStatistics = isMumbai ? MUMBAI_LEVEL_STATISTICS : LEVEL_STATISTICS;

  const trail = useMemo(() => {
    const styles = [];

    levelStatistics.map((statistic, index) => {
      styles.push({
        animationDelay: `${750 + index * 250}ms`,
        width: `calc(${100 / levelStatistics.length}%)`,
      });
      return null;
    });
    return styles;
  }, []);

  function getDatasetKey(statistic) {
    switch (statistic) {
      case 'active':
        return 'total.active';
      case 'positive':
        return 'delta.positive';
      case 'deaths':
        return 'delta.deaths';
      case 'discharged':
        return 'delta.discharged';
      case 'critical':
        return 'active.critical';
      case 'stable_symptomatic':
        return 'active.symptomatic';
      case 'stable_asymptomatic':
        return 'active.asymptomatic';
      default:
        return 'total.active';
    }
  }

  function getItemStatistics(statistic) {
    const datasetKey = getDatasetKey(statistic);
    const dataset = data.map((item) => item[datasetKey]);
    const result = dataset.reduce((item, prev) => prev + item, 0);
    return result;
  }

  return (
    <div className="Level">
      {levelStatistics.map((statistic, index) => (
        <animated.div
          key={index}
          className={classnames('level-item', `is-${statistic}`, 'fadeInUp')}
          style={trail[index]}
        >
          <LevelItem
            {...{statistic}}
            total={
              data.constructor === Array
                ? getItemStatistics(statistic)
                : getStatistic(data, 'total', statistic)
            }
            delta={getStatistic(data, 'delta', statistic)}
            totalActive={totalActive}
            totalCritical={totalCritical}
            totalStableSymptomatic={totalStableSymptomatic}
            totalStableAsymptomatic={totalStableAsymptomatic}
            totalDeaths={totalDeaths}
            fromState={fromState}
          />
        </animated.div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  return true;
};

export default memo(Level, isEqual);
