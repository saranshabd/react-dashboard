import StateMetaCard from './StateMetaCard';

import {STATE_NAMES} from '../constants';
import {
  formatDate,
  formatNumber,
  formatLastUpdated,
  getStatistic,
  getIndiaDateYesterdayISO,
  parseIndiaDate,
} from '../utils/commonFunctions';

import {formatISO, subDays} from 'date-fns';
import {memo} from 'react';
import {Compass} from 'react-feather';
import {useTranslation} from 'react-i18next';

function Fraction({numerator, denominator}) {
  return (
    <div className="frac">
      <span>{numerator}</span>
      <span className="bottom">{denominator}</span>
    </div>
  );
}

function StateMetaBottom({stateCode, data, timeseries}) {
  const {t} = useTranslation();

  const confirmedPerLakh = getStatistic(data[stateCode], 'total', 'confirmed', {
    normalizedByPopulationPer: 'lakh',
  });
  const testPerLakh = getStatistic(data[stateCode], 'total', 'tested', {
    normalizedByPopulationPer: 'lakh',
  });
  const totalConfirmedPerLakh = getStatistic(data['TT'], 'total', 'confirmed', {
    normalizedByPopulationPer: 'lakh',
  });

  const activePercent = getStatistic(data[stateCode], 'total', 'activeRatio');
  const recoveryPercent = getStatistic(
    data[stateCode],
    'total',
    'recoveryRatio'
  );
  const deathPercent = getStatistic(data[stateCode], 'total', 'cfr');

  // Show TPR for week preceeding last updated date
  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaDateYesterdayISO()
  );
  const lastDate = pastDates[pastDates.length - 1];
  const prevWeekDate = formatISO(subDays(parseIndiaDate(lastDate), 6));

  const tprWeek = getStatistic(timeseries?.[lastDate], 'delta', 'tpr', {
    movingAverage: true,
  });

  const reqData = {
    active_ccc1_facilities: 0,
    active_ccc2_facilities: 0,
    contact_traced_high_risk: 0,
    contact_traced_low_risk: 0,
    containment_zones_active_micro_sealed_buildings: 0,
    containment_zones_active_slums_chawls: 0,
    currently_quarantined_home: 0,
    bed_available_dchc_dch: 0,
    bed_available_dchc_dch_ccc2: 0,
    bed_available_icu: 0,
    bed_available_o2: 0,
    bed_available_ventilator: 0,
    bed_occupied_dchc_dch: 0,
    bed_occupied_dchc_dch_ccc2: 0,
    bed_occupied_icu: 0,
    bed_occupied_o2: 0,
    bed_occupied_ventilator: 0,
  };
  for (let i = 0; i < data.length - 1; ++i) {
    reqData.active_ccc1_facilities += data[i]['active.ccc1.facilities'];
    reqData.active_ccc2_facilities += data[i]['active.ccc2.facilities'];
    reqData.contact_traced_high_risk += data[i]['contact.traced.high.risk'];
    reqData.contact_traced_low_risk += data[i]['contact.traced.low.risk'];
    reqData.containment_zones_active_micro_sealed_buildings +=
      data[i]['containment.zones.active.micro.sealed.buildings'];
    reqData.containment_zones_active_slums_chawls +=
      data[i]['containment.zones.active.slums.chawls'];
    reqData.currently_quarantined_home += data[i]['currently.quarantined.home'];
    reqData.bed_available_dchc_dch += data[i]['bed.available.dchc.dch'];
    reqData.bed_available_dchc_dch_ccc2 +=
      data[i]['bed.available.dchc.dch.ccc2'];
    reqData.bed_available_icu += data[i]['bed.available.icu'];
    reqData.bed_available_o2 += data[i]['bed.available.o2'];
    reqData.bed_available_ventilator += data[i]['bed.available.ventilator'];
    reqData.bed_occupied_dchc_dch += data[i]['bed.occupied.dchc.dch'];
    reqData.bed_occupied_dchc_dch_ccc2 += data[i]['bed.occupied.dchc.dch.ccc2'];
    reqData.bed_occupied_icu += data[i]['bed.occupied.icu'];
    reqData.bed_occupied_o2 += data[i]['bed.occupied.o2'];
    reqData.bed_occupied_ventilator += data[i]['bed.occupied.ventilator'];
  }

  return (
    <>
      {reqData && (
        <>
          {/* <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('CCC Facilitiies')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Active CCC1 Facilities')}
              statistic={reqData.active_ccc1_facilities}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Active CCC2 Facilities')}
              statistic={reqData.active_ccc2_facilities}
            />
          </div> */}
          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Contact Tracing')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Contact Traced High Risk')}
              statistic={reqData.contact_traced_high_risk}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Contact Traced Low Risk')}
              statistic={reqData.contact_traced_low_risk}
            />
          </div>
          {/* <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Containment Measures')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Containment Zones Active Micro Sealed Buildings')}
              statistic={
                reqData.containment_zones_active_micro_sealed_buildings
              }
            />
            <StateMetaCard
              className="confirmed"
              title={t('Containment Zones Active Slums Chawls')}
              statistic={reqData.containment_zones_active_slums_chawls}
            />
          </div> */}
          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Quarantine Stats')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Currently Quarantined Home')}
              statistic={reqData.currently_quarantined_home}
            />
          </div>
          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Covid19 Bed Management')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            {/* <StateMetaCard
              className="confirmed"
              title={t('Bed Available DCHC DCH')}
              statistic={reqData.bed_available_dchc_dch}
            /> */}
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available DCHC DCH CCC2')}
              statistic={reqData.bed_available_dchc_dch_ccc2}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available ICU')}
              statistic={reqData.bed_available_icu}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available O2')}
              statistic={reqData.bed_available_o2}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available Ventilator')}
              statistic={reqData.bed_available_ventilator}
            />
            {/* <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied DCHC DCH')}
              statistic={reqData.bed_occupied_dchc_dch}
            /> */}
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied DCHC DCH CCC2')}
              statistic={reqData.bed_occupied_dchc_dch_ccc2}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied ICU')}
              statistic={reqData.bed_occupied_icu}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied O2')}
              statistic={reqData.bed_occupied_o2}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied Ventilator')}
              statistic={reqData.bed_occupied_ventilator}
            />
          </div>
        </>
      )}
    </>
  );
}

const isEqual = (prevProps, currProps) => {
  if (currProps.timeseries && !prevProps.timeseries) {
    return false;
  } else if (prevProps.stateCode !== currProps.stateCode) {
    return false;
  }
  return true;
};

export default memo(StateMetaBottom, isEqual);
