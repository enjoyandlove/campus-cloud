/**
 *
 * @param num: number
 * Input 1000
 * Output 1k
 */
export function kFormatter(num: number, decimals = 1) {
  return Math.abs(num) > 999
    ? Math.sign(num) * <any>(Math.abs(num) / 1000).toFixed(decimals) + 'k'
    : Math.sign(num) * Math.abs(num);
}
