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
import useIsVisible from '../hooks/useIsVisible';
import {
  fetcher,
  formatNumber,
  getStatistic,
  parseIndiaDate,
  retry,
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

function Mumbai() {
  // const {t} = useTranslation();

  const stateCode = useParams().stateCode.toUpperCase();

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

  // const toggleShowAllDistricts = () => {
  //   setShowAllDistricts(!showAllDistricts);
  // };

  // const handleSort = (districtNameA, districtNameB) => {
  //   const districtA = stateData.districts[districtNameA];
  //   const districtB = stateData.districts[districtNameB];
  //   return (
  //     getStatistic(districtB, 'total', mapStatistic) -
  //     getStatistic(districtA, 'total', mapStatistic)
  //   );
  // };

  // const gridRowCount = useMemo(() => {
  //   if (!stateData) return;
  //   const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
  //   const districtCount = stateData?.districts
  //     ? Object.keys(stateData.districts).filter(
  //         (districtName) => districtName !== 'Unknown'
  //       ).length
  //     : 0;
  //   const gridRowCount = Math.ceil(districtCount / gridColumnCount);
  //   return gridRowCount;
  // }, [stateData]);

  const stateMetaElement = useRef();
  const isStateMetaVisible = useIsVisible(stateMetaElement);

  // const trail = useMemo(() => {
  //   const styles = [];

  //   [0, 0, 0, 0].map((element, index) => {
  //     styles.push({
  //       animationDelay: `${index * 250}ms`,
  //     });
  //     return null;
  //   });
  //   return styles;
  // }, []);

  // const lookback = showAllDistricts ? (window.innerWidth >= 540 ? 10 : 8) : 6;

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

  // const primaryStatistic = MUMBAI_MAP_STATISTICS.includes(mapStatistic)
  //   ? mapStatistic
  //   : 'confirmed';

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
    return <h1>Something went wrong</h1>;
  }
  if (timeseriesResponseError2) {
    console.log(timeseriesResponseError2);
    return <h1>Something went wrong</h1>;
  }
  if (error) {
    console.log(error);
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

  // const districts = Object.keys(
  //   ((!noDistrictData || !statisticConfig.hasPrimary) &&
  //     stateData?.districts) ||
  //     {}
  // );

  const timeseriesDates = {};
  for (let i = 0; i < timeseries.length; ++i) {
    timeseriesDates[timeseries[i]['date']] = {
      active: timeseries[i]['total.active'],
      positive: timeseries[i]['delta.positive'],
      deaths: timeseries[i]['delta.deaths'],
      discharged: timeseries[i]['delta.discharged'],
      critical: timeseries[i]['active.critical'],
      stable_symptomatic: timeseries[i]['active.symptomatic'],
      stable_asymptomatic: timeseries[i]['active.asymptomatic'],
    };
  }

  const timeseriesDatesnew = {};
  for (let i = 0; i < timeseries.length; ++i) {
    timeseriesDatesnew[timeseries[i]['date']] = {};
  }

  // console.log(timeseriesDates);
  // console.log(timeseries);

  const newDates = {};
  for (let i = 0; i < timeseries.length; ++i) {
    newDates[timeseries[i]['date']] = {
      delta: {
        confirmed: timeseries[i]['total.active'],
        critical: timeseries[i]['total.active'],
        deceased: timeseries[i]['delta.deaths'],
        other: timeseries[i]['delta.tests'],
        recovered: timeseries[i]['delta.discharged'],
        tested: timeseries[i]['delta.tests'],
      },
    };
  }
  const newSendingObj = {MU: {dates: newDates}};

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

  // console.log(rechartActiveData);
  // console.log(rechartData);

  // console.log(timeseries);
  // // console.log(newSendingObj);
  // console.log(timeseries2);
  // console.log(Object.keys(timeseries2['Mumbai']));
  const wards = Object.keys(timeseries2['Mumbai']);
  // All values of the wards
  Object.keys(timeseries2['Mumbai']).forEach((e) => {
    console.log(e);
  });
  console.log(Object.keys(timeseries2['Mumbai']).length);
  console.log(timeseries2['Mumbai']['A'].length);
  // console.log(stateData);
  //console.log(Object.keys(timeseries2['Mumbai']['A'][0]));

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
        cases +=
          +timeseries2['Mumbai']['A'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['B'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['C'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['D'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['E'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['FN'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['FS'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['GN'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['GS'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['HE'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['HW'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['KE'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['KW'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['L'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['ME'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['MW'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['N'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['PN'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['PS'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['RC'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['RN'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['RS'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['S'][j][date]['delta.confirmed'] +
          timeseries2['Mumbai']['T'][j][date]['delta.confirmed'];
        break;
      }
    }
    rechartConfirmedData.push({date: date, cases: cases});
  }

  console.log(rechartConfirmedData);

  // Data for Recovered
  const rechartRecoveredData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases +=
          +timeseries2['Mumbai']['A'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['B'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['C'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['D'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['E'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['FN'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['FS'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['GN'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['GS'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['HE'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['HW'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['KE'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['KW'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['L'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['ME'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['MW'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['N'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['PN'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['PS'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['RC'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['RN'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['RS'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['S'][j][date]['delta.recovered'] +
          timeseries2['Mumbai']['T'][j][date]['delta.recovered'];
        break;
      }
    }
    rechartRecoveredData.push({date: date, cases: cases});
  }

  // Data for Total Sealed Building
  const rechartTSBData = [];
  for (let i = 0; i < timeseries2['Mumbai']['A'].length; i++) {
    const date = allDates[i].date;
    let cases = 0;
    for (let j = 0; j < timeseries2['Mumbai']['A'].length; j++) {
      if (timeseries2['Mumbai']['A'][j][date]) {
        cases +=
          +timeseries2['Mumbai']['A'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['B'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['C'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['D'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['E'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['FN'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['FS'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['GN'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['GS'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['HE'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['HW'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['KE'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['KW'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['L'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['ME'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['MW'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['N'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['PN'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['PS'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['RC'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['RN'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['RS'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['S'][j][date]['total.sealedbuildings'] +
          timeseries2['Mumbai']['T'][j][date]['total.sealedbuildings'];

        break;
      }
    }
    rechartTSBData.push({date: date, cases: cases});
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

      <div className="State" style={{position: 'relative'}}>
        <br />
        <br />
        <MapSwitcher {...{mapStatistic, setMapStatistic}} isMumbai={true} />
        <Level data={stateData} isMumbai={true} />
        <Minigraphs
          timeseries={timeseriesDates}
          {...{stateCode}}
          forceRender={!!timeseriesResponseError}
          isMumbai={true}
        />
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

      {/* <div className="State">
        <div className="state-left">
          <StateHeader data={stateData} stateCode={stateCode} />

          {stateData?.total?.vaccinated1 && (
            <VaccinationHeader data={stateData} />
          )}

          {data && (
            <Suspense fallback={<div style={{minHeight: '50rem'}} />}>
              <MapExplorer
                {...{
                  stateCode,
                  data,
                  regionHighlighted,
                  setRegionHighlighted,
                  mapStatistic,
                  setMapStatistic,
                  lastDataDate,
                  delta7Mode,
                  setDelta7Mode,
                  noRegionHighlightedDistrictData,
                  noDistrictData,
                }}
              ></MapExplorer>
            </Suspense>
          )}
        </div>

        <div className="state-right">
          <>
            <div className="Rechart">
              <Rechart title={'Active'} data={rechartData[0].dates} />
              <Rechart title={'Confirmed'} data={rechartConfirmedData} />
              <Rechart title={'Deseased'} data={rechartData[1].dates} />
              <Rechart title={'Recovered'} data={rechartRecoveredData} />
              <Rechart title={'Total Sealed Buildings'} data={rechartTSBData} />
              <Rechart title={'Total Sealed Floor'} data={rechartTSFData} />
              <Rechart title={'Positive'} data={rechartData[0].dates} />
            </div>
          </>
        </div>
      </div> */}
      <div className="stateMap">
        <h1>
          <StateMap
            wards={wards}
            data={timeseries2['Mumbai']}
            allDates={allDates}
          />
        </h1>
      </div>

      <Footer />
    </>
  );
}

export default memo(Mumbai);
