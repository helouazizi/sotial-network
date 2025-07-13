export default function FormatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number): string => String(n).padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
