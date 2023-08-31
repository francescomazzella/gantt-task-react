import React from 'react';
import styles from './no-data.module.css';
import { NoDataContent } from '../../types/public-types';

const localizedText: { [key: string]: string } = {
  en: 'No data',
  ru: 'Нет данных',
  de: 'Keine Daten',
  fr: 'Pas de données',
  es: 'Sin datos',
  pt: 'Sem dados',
  it: 'Nessun dato',
  tr: 'Veri yok',
  nl: 'Geen gegevens',
  'zh-cn': '没有数据',
  'zh-tw': '沒有數據',
  pl: 'Brak danych',
  ja: 'データなし',
  ko: '데이터 없음',
  sv: 'Inga data',
  da: 'Ingen data',
  nb: 'Ingen data',
  fi: 'Ei tietoja',
  he: 'אין נתונים',
  id: 'Tidak ada data',
  cs: 'Žádná data',
  el: 'Δεν υπάρχουν δεδομένα',
  ro: 'Nu există date',
  sk: 'Žiadne údaje',
  th: 'ไม่มีข้อมูล',
  bg: 'Няма данни',
  hu: 'Nincs adat',
  vi: 'Không có dữ liệu',
};

export const NoData: NoDataContent = ({ fontFamily, fontSize, locale, style }) => {

  return (
    <div className={styles.noData} style={style}>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 122.883 104.293" xmlSpace='preserve'><path fillRule="evenodd" clipRule="evenodd" d="M4.878 104.293h113.125c2.682 0 4.879-2.211 4.879-4.914l-.115-38.84c-.006-2.645-.387-4.012-1.338-6.492L102.379 4.38C101.516 2.132 100.408 0 97.998 0H25.729c-2.41 0-3.488 2.144-4.38 4.38L1.22 54.865C.254 57.289.157 58.674.148 61.303L0 99.379c0 2.703 2.198 4.914 4.878 4.914zm102.618-46.775H82.111l-7.758 15.617h-25.72l-7.862-15.617H15.195l17.922-41.943h57.184l17.195 41.943z" /></svg>
      <span style={{
        fontFamily,
        fontSize,
      }}>
        {localizedText[locale] ?? localizedText[locale?.split('-').shift() ?? 'en']}
      </span>
    </div>
  );
}
