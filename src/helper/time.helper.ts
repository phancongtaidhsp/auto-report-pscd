export const timeToMinuteHour = (time: string) => {
  let [hour, minute] = time.split(":")
  hour = `${parseInt(hour)}`
  minute = `${parseInt(minute)}`
  return [hour, minute]
}