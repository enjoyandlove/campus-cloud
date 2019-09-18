/**
 *
 * @param num: number
 * Input 1000
 * Output 1k
 */
export function kFormatter(num: number) {
  return Math.abs(num) > 999
    ? Math.sign(num) * <any>(Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
}
