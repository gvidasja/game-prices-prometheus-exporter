export const repeat = (intervalSeconds: number, func: () => void): NodeJS.Timeout => {
  func()
  return setInterval(func, intervalSeconds * 1000)
}
