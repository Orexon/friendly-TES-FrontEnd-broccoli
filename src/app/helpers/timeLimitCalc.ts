export function calculateTimeLimit(num: BigInt) {
  const ticks = BigInt(num.valueOf());
  const myNumber = Number(ticks);

  var days = Math.floor(myNumber / (24 * 60 * 60 * 10000000));
  var hours = Math.round(myNumber / (60 * 60 * 10000000)) % 24;
  var mins = Math.round((myNumber / (60 * 10000000)) % 60);

  var totalHours = days * 24 + hours;
  var totalMinutes = totalHours * 60;
  var totalSeconds = totalMinutes * 60;

  const timeLimit = {
    days,
    hours,
    mins,
    totalHours,
    totalMinutes,
    totalSeconds,
  };

  return timeLimit;
}
