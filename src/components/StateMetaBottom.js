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

  // Show TPR for week preceeding last updated date
  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaDateYesterdayISO()
  );

  // console.log(pastDates);

  // Object.keys(timeseries).forEach((ele) => {
  //   reqData.contact_traced_high_risk +=
  //     timeseries[ele]['contact.traced.high.risk'];
  //   reqData.contact_traced_low_risk +=
  //     timeseries[ele]['contact.traced.low.risk'];
  //   reqData.currently_quarantined_home +=
  //     timeseries[ele]['currently.quarantined.home'];
  //   reqData.bed_available_dchc_dch_ccc2 +=
  //     timeseries[ele]['bed.available.dchc.dch.ccc2'];
  //   reqData.bed_available_icu += timeseries[ele]['bed.available.icu'];
  //   reqData.bed_available_o2 += timeseries[ele]['bed.available.o2'];
  //   reqData.bed_available_ventilator +=
  //     timeseries[ele]['bed.available.ventilator'];
  //   reqData.bed_occupied_dchc_dch_ccc2 +=
  //     timeseries[ele]['bed.occupied.dchc.dch.ccc2'];
  //   reqData.bed_occupied_icu += timeseries[ele]['bed.occupied.icu'];
  //   reqData.bed_occupied_o2 += timeseries[ele]['bed.occupied.o2'];
  //   reqData.bed_occupied_ventilator +=
  //     timeseries[ele]['bed.occupied.ventilator'];
  // });

  const totalRecord = Object.keys(timeseries).length;
  // console.log(totalRecord);
  // console.log(pastDates[totalRecord - 1]);

  const currentDateData = timeseries[pastDates[totalRecord - 1]];
  const reqData = {
    contact_traced_high_risk: currentDateData['contact.traced.high.risk'],
    contact_traced_low_risk: currentDateData['contact.traced.low.risk'],
    currently_quarantined_home: currentDateData['currently.quarantined.home'],
    bed_available_dchc_dch_ccc2: currentDateData['bed.available.dchc.dch.ccc2'],
    bed_available_icu: currentDateData['bed.available.icu'],
    bed_available_o2: currentDateData['bed.available.o2'],
    bed_available_ventilator: currentDateData['bed.available.ventilator'],
    bed_occupied_dchc_dch_ccc2: currentDateData['bed.occupied.dchc.dch.ccc2'],
    bed_occupied_icu: currentDateData['bed.occupied.icu'],
    bed_occupied_o2: currentDateData['bed.occupied.o2'],
    bed_occupied_ventilator: currentDateData['bed.occupied.ventilator'],
  };

  function numberWithCommas(x) {
    if (x || x == 0) {
      x = x.toString();
      var lastThree = x.substring(x.length - 3);
      var otherNumbers = x.substring(0, x.length - 3);
      if (otherNumbers != '') lastThree = ',' + lastThree;
      var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
      return res;
    }
  }

  return (
    <>
      {reqData && (
        <>
          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Contact Tracing')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Contact Traced High Risk')}
              statistic={numberWithCommas(reqData.contact_traced_high_risk)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Contact Traced Low Risk')}
              statistic={numberWithCommas(reqData.contact_traced_low_risk)}
            />
          </div>

          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Quarantine Stats')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Currently Quarantined Home')}
              statistic={numberWithCommas(reqData.currently_quarantined_home)}
            />
          </div>
          <div className="StateMetaBottom population">
            <div className="meta-item population">
              <h3>{t('Covid19 Bed Management')}</h3>
            </div>
          </div>
          <div className="StateMetaBottom">
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available DCHC DCH CCC2')}
              statistic={numberWithCommas(reqData.bed_available_dchc_dch_ccc2)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available ICU')}
              statistic={numberWithCommas(reqData.bed_available_icu)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available O2')}
              statistic={numberWithCommas(reqData.bed_available_o2)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Available Ventilator')}
              statistic={numberWithCommas(reqData.bed_available_ventilator)}
            />

            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied DCHC DCH CCC2')}
              statistic={numberWithCommas(reqData.bed_occupied_dchc_dch_ccc2)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied ICU')}
              statistic={numberWithCommas(reqData.bed_occupied_icu)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied O2')}
              statistic={numberWithCommas(reqData.bed_occupied_o2)}
            />
            <StateMetaCard
              className="confirmed"
              title={t('Bed Occupied Ventilator')}
              statistic={numberWithCommas(reqData.bed_occupied_ventilator)}
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
