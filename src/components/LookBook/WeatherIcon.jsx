import styles from './../../styles/pages/Lookbookpage.module.scss';

export function WeatherIcon({ weatherIcon }) {
  return (
    <div className={styles.weatherIcon}>
      <img src={weatherIcon.src} alt={weatherIcon.alt} />
    </div>
  );
}
