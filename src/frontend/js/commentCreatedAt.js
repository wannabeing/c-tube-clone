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
// 모든 small 태그
const createdSmall = document.getElementsByClassName("commentCreated");

for (let i = 0; i < createdSmall.length; i++) {
  const createdAt = new Date(createdSmall[i].dataset.comment_created);
  const newCreatedAt = displayedAt(createdAt);
  createdSmall[i].innerText = newCreatedAt;
}
