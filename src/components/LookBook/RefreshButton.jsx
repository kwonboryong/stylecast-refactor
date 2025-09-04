import styles from './../../styles/pages/Lookbookpage.module.scss';
import Button from './../../components/Button/Button';
import { IoRefreshSharp } from 'react-icons/io5';

export function RefreshButton({ onRefresh }) {
  return (
    <div className={styles.refreshBtn}>
      <Button
        icon={<IoRefreshSharp />}
        active={true}
        onClick={onRefresh}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          width: '31px',
          height: '31px',
          marginLeft: '-4px',
        }}
      />
    </div>
  );
}
