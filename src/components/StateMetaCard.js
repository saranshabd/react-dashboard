import Tooltip from './Tooltip';

import {InfoIcon} from '@primer/octicons-react';
import {useTranslation} from 'react-i18next';
import StateMetaMap from './StateMetaMap';

function StateMetaCard({
  title,
  statistic,
  total,
  formula,
  date,
  description,
  className,
  isMumbai = false,
  data = {},
}) {
  const {t} = useTranslation();

  return (
    <div className={`meta-item ${className}`}>
      <div className="meta-item-top">
        <h3>{title}</h3>
        {formula && (
          <Tooltip message={formula}>
            <InfoIcon size={16} />
          </Tooltip>
        )}
      </div>
      {statistic && <h1>{statistic}</h1>}
      {date && <h5>{date}</h5>}

      {total && <h5>{`${t('India has')} ${total} ${t('CPL')}`}</h5>}
      {description && <p>{description}</p>}
      {isMumbai && <StateMetaMap newData={data} />}
    </div>
  );
}

export default StateMetaCard;
