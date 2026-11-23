const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

/** 26000 → "26 000 ₽" */
export function money(n: number, currency = '₽') {
  const v = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${v} ${currency}`;
}

const parts = (iso: string) => iso.split('-').map(Number) as [number, number, number];

/** "2026-05-17" → "17 мая" */
export function day(iso: string) {
  const [, m, d] = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
}

/** ("2026-05-15", "2026-05-22") → "15–22 мая" */
export function dateRange(start: string, end: string) {
  const [, m1, d1] = parts(start);
  const [, m2, d2] = parts(end);
  return m1 === m2 ? `${d1}–${d2} ${MONTHS[m1 - 1]}` : `${day(start)} – ${day(end)}`;
}

/** "15.05" or "15.05.2026" → "2026-05-15"; null if invalid */
export function parseDate(input: string, defaultYear = 2026): string | null {
  const m = input.trim().match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?$/);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), m[3] ? Number(m[3]) : defaultYear];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** 4 → "4 участника" */
export function plural(n: number, one: string, few: string, many: string) {
  const a = n % 10, b = n % 100;
  const w = a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many;
  return `${n} ${w}`;
}
