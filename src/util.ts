export const repeat = <T extends any[]>(
  intervalSeconds: number,
  func: () => void,
  ...args: T
): NodeJS.Timeout => {
  return setInterval(func, intervalSeconds * 1000, ...args)
}
