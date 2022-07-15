import {
  DATA_API_ROOT,
  DATA_API_ROOT_MUMBAI_DISTRICT,
  MAP_STATISTICS,
  MUMBAI_MAP_STATISTICS,
  PRIMARY_STATISTICS,
  MUMBAI_PRIMARY_STATISTICS,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY,
  DATA_API_ROOT_MUMBAI_WARD,
} from '../constants';
import TableLoader from './loaders/Table';

import useIsVisible from '../hooks/useIsVisible';
import {
  fetcher,
  formatNumber,
  getStatistic,
  parseIndiaDate,
  retry,
  getIndiaDateYesterdayISO,
} from '../utils/commonFunctions';

import {SmileyIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {formatISO, max} from 'date-fns';
import {
  memo,
  useMemo,
  useState,
  useEffect,
  lazy,
  Suspense,
  useRef,
} from 'react';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useSessionStorage} from 'react-use';
import useSWR from 'swr';
import StateMetaBottom from './StateMetaBottom';
import Rechart from './Rechart';
import StateMap from './StateMap';
import MumbaiTable from './MumbaiTable';

const DeltaBarGraph = lazy(() => retry(() => import('./DeltaBarGraph')));
const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));
const VaccinationHeader = lazy(() =>
  retry(() => import('./VaccinationHeader'))
);
const MapExplorer = lazy(() => retry(() => import('./MapExplorer')));
const MapSwitcher = lazy(() => retry(() => import('./MapSwitcher')));
const Minigraphs = lazy(() => retry(() => import('./Minigraphs')));
const StateHeader = lazy(() => retry(() => import('./StateHeader')));
const StateMeta = lazy(() => retry(() => import('./StateMeta')));
const Table = lazy(() => retry(() => import('./Table')));

function NewMumbai() {
  // const {t} = useTranslation();

  const stateCode = 'MU';

  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active'
  );
  // const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: stateCode,
    districtName: null,
  });
  const [delta7Mode, setDelta7Mode] = useState(false);

  useEffect(() => {
    if (regionHighlighted.stateCode !== stateCode) {
      setRegionHighlighted({
        stateCode: stateCode,
        districtName: null,
      });
      setShowAllDistricts(false);
    }
  }, [regionHighlighted.stateCode, stateCode]);

  const {data: timeseries, error: timeseriesResponseError} = useSWR(
    `${DATA_API_ROOT_MUMBAI_DISTRICT}`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );
  const {data: timeseries2, error: timeseriesResponseError2} = useSWR(
    `${DATA_API_ROOT_MUMBAI_WARD}`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data, error} = useSWR(`${DATA_API_ROOT_MUMBAI_DISTRICT}`, fetcher, {
    revalidateOnMount: true,
    refreshInterval: 100000,
  });

  const stateData = data;

  const stateMetaElement = useRef();
  const isStateMetaVisible = useIsVisible(stateMetaElement);

  const lastDataDate = useMemo(() => {
    const updatedDates = [
      stateData?.meta?.date,
      stateData?.meta?.tested?.date,
      stateData?.meta?.vaccinated?.date,
    ].filter((date) => date);
    return updatedDates.length > 0
      ? formatISO(max(updatedDates.map((date) => parseIndiaDate(date))), {
          representation: 'date',
        })
      : null;
  }, [stateData]);

  const noDistrictData = useMemo(() => {
    // Heuristic: All cases are in Unknown
    return !!(
      stateData?.districts &&
      stateData.districts?.[UNKNOWN_DISTRICT_KEY] &&
      MUMBAI_PRIMARY_STATISTICS.every(
        (statistic) =>
          getStatistic(stateData, 'total', statistic) ===
          getStatistic(
            stateData.districts[UNKNOWN_DISTRICT_KEY],
            'total',
            statistic
          )
      )
    );
  }, [stateData]);

  if (timeseriesResponseError) {
    console.log(timeseriesResponseError);
    location.reload();
    return <h1>Something went wrong</h1>;
  }
  if (timeseriesResponseError2) {
    console.log(timeseriesResponseError2);
    location.reload();
    return <h1>Something went wrong</h1>;
  }
  if (error) {
    console.log(error);
    location.reload();
    return <h1>Something went wrong</h1>;
  }
  if (!timeseries || !timeseries2 || !data) {
    return <h1>Loading</h1>;
  }

  // const statisticConfig = STATISTIC_CONFIGS[primaryStatistic];

  const noRegionHighlightedDistrictData =
    regionHighlighted?.districtName &&
    regionHighlighted.districtName !== UNKNOWN_DISTRICT_KEY &&
    noDistrictData;

  const timeseriesDates = {};
  const timeseriesDate = Object.keys(timeseries);
  for (let i = 0; i < Object.keys(timeseries).length; ++i) {
    const date = timeseriesDate[i];

    timeseriesDates[date] = {
      active: timeseries[timeseriesDate[i]]['total.active'],
      positive: timeseries[timeseriesDate[i]]['delta.positive'],
      deaths: timeseries[timeseriesDate[i]]['delta.deaths'],
      discharged: timeseries[timeseriesDate[i]]['delta.discharged'],
      critical: timeseries[timeseriesDate[i]]['active.critical'],
      stable_symptomatic: timeseries[timeseriesDate[i]]['active.symptomatic'],
      stable_asymptomatic: timeseries[timeseriesDate[i]]['active.asymptomatic'],
    };
  }

  // Data which will be send to Rechart
  const rechartData = [];

  // Data for active
  const rechartActiveData = [];
  for (let i = 0; i < timeseries.length; ++i) {
    const d = {
      date: timeseries[i].date,
      cases: timeseries[i]['total.active'],
    };
    rechartActiveData.push(d);
  }

  rechartData.push({type: 'active', dates: rechartActiveData});

  // Data for deceased
  const rechartDeceasedData = [];
  for (let i = 0; i < timeseries.length; ++i) {
    const d = {
      date: timeseries[i].date,
      cases: timeseries[i]['delta.deaths'],
    };
    rechartDeceasedData.push(d);
  }

  rechartData.push({type: 'deceased', dates: rechartDeceasedData});

  // Data for positive
  const rechartPositiveData = [];
  for (let i = 0; i < timeseries.length; ++i) {
    const d = {
      date: timeseries[i].date,
      cases: timeseries[i]['delta.positive'],
    };
    rechartPositiveData.push(d);
  }

  rechartData.push({type: 'positive', dates: rechartPositiveData});

  const wards = Object.keys(timeseries2['Mumbai']);

  // All dates in the timeseries2
  const allDates = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const d = timeseries2['Mumbai']['A'][i];
    //console.log(Object.keys(d)[0]);
    allDates.push({date: Object.keys(d)[0], cases: 0});
  }
  // console.log(allDates);

  // Data for confirmed
  const rechartConfirmedData = [];
  // console.log(rechartConfirmedData);
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases += timeseries2['Mumbai']['A'][j][date]['delta.confirmed'];
        break;
      }
    }
    rechartConfirmedData.push({date: date, cases: cases});
  }

  // Data for confirmed
  const deceasedData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases += timeseries2['Mumbai']['A'][j][date]['delta.deceased'];
        break;
      }
    }
    deceasedData.push({date: date, cases: cases});
  }

  // Data for Recovered
  const rechartRecoveredData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases += timeseries2['Mumbai']['A'][j][date]['delta.recovered'];
        break;
      }
    }
    rechartRecoveredData.push({date: date, cases: cases});
  }

  // Data for Total Sealed Building
  const meanRTData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases += timeseries2['Mumbai']['A'][j][date]['mean.RT'];

        break;
      }
    }
    const roundOfCases = (Math.round(cases * 100) / 100).toFixed(2);
    meanRTData.push({date: date, cases: roundOfCases});
  }

  // Data for Total Sealed Building
  const rechartTSFData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases +=
          +timeseries2['Mumbai']['A'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['B'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['C'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['D'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['E'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['FN'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['FS'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['GN'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['GS'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['HE'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['HW'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['KE'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['KW'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['L'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['ME'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['MW'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['N'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['PN'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['PS'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['RC'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['RN'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['RS'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['S'][j][date]['total.sealedfloors'] +
          timeseries2['Mumbai']['T'][j][date]['total.sealedfloors'];
        break;
      }
    }
    rechartTSFData.push({date: date, cases: cases});
  }

  let totalActive = 0;

  let totalCritical = 0;

  let totalStableSymptomatic = 0;

  let totalStableAsymptomatic = 0;

  let totalDeaths = 0;

  // Show TPR for week preceeding last updated date
  const pastDates = Object.keys(timeseries || {}).filter(
    (date) => date <= getIndiaDateYesterdayISO()
  );

  totalActive = timeseries[pastDates[pastDates.length - 1]]['total.active'];
  totalCritical =
    timeseries[pastDates[pastDates.length - 1]]['active.critical'];
  totalStableSymptomatic =
    timeseries[pastDates[pastDates.length - 1]]['active.symptomatic'];
  totalStableAsymptomatic =
    timeseries[pastDates[pastDates.length - 1]]['active.asymptomatic'];
  totalDeaths = timeseries[pastDates[pastDates.length - 1]]['delta.deaths'];

  // console.log(data);
  // console.log(regionHighlighted);
  // console.log(setRegionHighlighted);
  // console.log(expandTable);
  // console.log(setExpandTable);
  // console.log(hideDistrictData);
  // console.log(hideDistrictTestData);
  // console.log(hideVaccinated);
  // console.log(lastDataDate);
  // console.log(noDistrictDataStates);

  console.log(timeseries2);
  console.log(Object.keys(timeseries2['Mumbai']).length);

  console.log(pastDates[pastDates.length - 1]);

  const data2 = {};

  for (let i = 0; i < Object.keys(timeseries2['Mumbai']).length; i++) {
    const district = Object.keys(timeseries2['Mumbai'])[i];
    const date = pastDates[pastDates.length - 1];
    const len = timeseries2['Mumbai'][district].length;
    const d = timeseries2['Mumbai'][district][len - 1];
    console.log(timeseries2['Mumbai'][district][len - 1]);
    data2[district] = {
      total: {
        confirmed: d[date]['delta.confirmed'],
        deceased: d[date]['delta.deceased'],
        recovered: d[date]['delta.recovered'],
        RT: d[date]['mean.RT'],
      },
    };
    // data2.push({
    //   [district]: {
    //     total: {
    //       confirmed: d[date]['delta.confirmed'],
    //     },
    //   },
    // });
  }

  console.log(data2);

  return (
    <>
      <Helmet>
        <title>
          Coronavirus Outbreak in {STATE_NAMES[stateCode]} - covid19india.org
        </title>
        <meta
          name="title"
          content={`Coronavirus Outbreak in ${STATE_NAMES[stateCode]}: Latest Map and Case Count`}
        />
      </Helmet>
      <div className="dateDiv">
        <div className="StateMetaBottom population">
          <div className="meta-item population">
            <h2>
              Latest Data as of date: <u>{[pastDates[pastDates.length - 1]]}</u>
            </h2>
          </div>
        </div>
      </div>

      <div className="State" style={{position: 'relative'}}>
        <br />
        <br />
        <MapSwitcher {...{mapStatistic, setMapStatistic}} isMumbai={true} />
        {/* {totalActive &&
          totalCritical &&
          totalStableSymptomatic &&
          totalStableAsymptomatic &&
          totalDeaths && (
            <Level
              data={stateData}
              isMumbai={true}
              totalActive={totalActive}
              totalCritical={totalCritical}
              totalStableSymptomatic={totalStableSymptomatic}
              totalStableAsymptomatic={totalStableAsymptomatic}
              totalDeaths={totalDeaths}
              fromState={true}
            />
          )} */}
        <Level
          data={stateData}
          isMumbai={true}
          totalActive={totalActive}
          totalCritical={totalCritical}
          totalStableSymptomatic={totalStableSymptomatic}
          totalStableAsymptomatic={totalStableAsymptomatic}
          totalDeaths={totalDeaths}
          fromState={true}
        />
        <Minigraphs
          timeseries={timeseriesDates}
          {...{stateCode}}
          forceRender={!!timeseriesResponseError}
          isMumbai={true}
          test={'mumbai'}
        />
      </div>
      {/* <div className="State">
        {data && (
          <Suspense fallback={<div />}>
            <StateMetaBottom
              {...{
                stateCode,
                data,
              }}
              timeseries={timeseries}
            />
          </Suspense>
        )}
      </div> */}
      <div className="stateMap">
        <h1>Ward-Wise Stats</h1>
      </div>
      <div className="State">
        <div className={classnames('state-left')}>
          {wards && timeseries2 && pastDates[pastDates.length - 1] && (
            <MumbaiTable
              wards={wards}
              timeseries2={timeseries2}
              date={pastDates[pastDates.length - 1]}
            />
          )}
        </div>
        <div className={classnames('state-right')}>
          {allDates &&
            wards &&
            timeseries2 &&
            rechartConfirmedData &&
            rechartRecoveredData &&
            deceasedData &&
            meanRTData && (
              <StateMap
                wards={wards}
                data={timeseries2['Mumbai']}
                allDates={allDates}
                allConfirmedData={rechartConfirmedData}
                allRecoveredData={rechartRecoveredData}
                allDeceasedData={deceasedData}
                allMeanRT={meanRTData}
              />
            )}
        </div>
      </div>

      <div className="State">
        {data && (
          <Suspense fallback={<div />}>
            <StateMetaBottom
              {...{
                stateCode,
                data,
              }}
              timeseries={timeseries}
            />
          </Suspense>
        )}
      </div>

      {/* <div className="stateMap">
        <h1>
          {allDates &&
            wards &&
            timeseries2 &&
            rechartConfirmedData &&
            rechartRecoveredData &&
            deceasedData &&
            meanRTData && (
              <StateMap
                wards={wards}
                data={timeseries2['Mumbai']}
                allDates={allDates}
                allConfirmedData={rechartConfirmedData}
                allRecoveredData={rechartRecoveredData}
                allDeceasedData={deceasedData}
                allMeanRT={meanRTData}
              />
            )}
        </h1>
      </div> */}

      <Footer />
    </>
  );
}

export default memo(NewMumbai);
