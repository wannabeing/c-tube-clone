// 시간표시 계산 함수
function displayedAt(createdAt) {
  const milliSeconds = new Date() - createdAt;
  const seconds = milliSeconds / 1000;
  if (seconds < 60) return `방금 전`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;
  const weeks = days / 7;
  if (weeks < 5) return `${Math.floor(weeks)}주 전`;
  const months = days / 30;
  if (months < 12) return `${Math.floor(months)}개월 전`;
  const years = days / 365;
  return `${Math.floor(years)}년 전`;
}
// 모든 timeSpan 태그
const timeSpan = document.getElementsByClassName("createdAt");
if (timeSpan) {
  for (let i = 0; i < timeSpan.length; i++) {
    const createdAt = new Date(timeSpan[i].dataset.createdat);
    const newCreatedAt = displayedAt(createdAt);
    timeSpan[i].innerText = newCreatedAt;
  }
}
