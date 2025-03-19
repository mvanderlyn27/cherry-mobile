export const formatReadingTime = (totalTime: number, progress: number): string => {
  const finished = progress === 100;
  const timeLeft = finished ? totalTime : totalTime * (1 - progress / 100);
  
  if (timeLeft >= 60) {
    // Convert to hours and round to nearest 0.5
    const hours = Math.round(timeLeft / 30) / 2;
    return `${hours}h${finished ? "" : " left"}`;
  } else {
    // Round to nearest minute
    const minutes = Math.round(timeLeft);
    return `${minutes}m${finished ? "" : " left"}`;
  }
};