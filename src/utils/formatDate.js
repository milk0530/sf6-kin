/** ISO文字列を "2024/3/25" 形式に整形 */
export function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
