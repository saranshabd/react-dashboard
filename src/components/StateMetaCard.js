import Tooltip from './Tooltip';

import {InfoIcon} from '@primer/octicons-react';
import {useTranslation} from 'react-i18next';

function StateMetaCard({
  title,
  statistic,
  total,
  formula,
  date,
  description,
  className,
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
    </div>
  );
}

export default StateMetaCard;
