export function BuildMediaLinkCAS(file: File): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const d = new Date();
  const stamp =
    `${d.getFullYear()}-` +
    `${pad(d.getMonth() + 1)}-` +
    `${pad(d.getDate())} ` +
    `${pad(d.getHours())}:` +
    `${pad(d.getMinutes())}:` +
    `${pad(d.getSeconds())}`;

  return `${stamp}_${file.name}`;
}