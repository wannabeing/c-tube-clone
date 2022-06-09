const videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volInput = document.querySelector("#vol");
const currentTime = document.querySelector("#current");
const totalTime = document.querySelector("#total");
const timeLine = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullscreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoControllers = document.querySelector("#videoControllers");

// Reset Video's MouseMove TimeoutID
let timeoutID = null;

// Reset Video's Volume
let defaultVol = 1;
video.volume = defaultVol;

// Format Video's PlayTime
const formatPlayTime = (val) => {
  const startIdx = val >= 3600 ? 11 : 14;
  return new Date(val * 1000).toISOString().substring(startIdx, 19);
};
// Reset TimeLine Status
let videoStatus = false;

// PlayBtn Clciked
const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
// MuteBtn Clicked
const handleMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  // 볼륨이 0인 상태에서 음소거 해제 버튼 누를 경우
  if (Number(defaultVol) === 0) {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volInput.value = video.muted ? 0 : defaultVol;
};
// Video Volume Control
const handleInputVol = (event) => {
  const { value } = event.target;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  if (Number(value) === 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  defaultVol = value;
  video.volume = value;
};
const handleVideoPause = () => {};
const handleVideoPlay = () => {};

// Video's Time Data Settings 1
const handleVideoMetaData = () => {
  totalTime.innerText = formatPlayTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};
// Video's Time Data Settings 2
const handleTimeUpdate = () => {
  currentTime.innerText = formatPlayTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

const handleTimeLine = (event) => {
  const { value } = event.target;
  video.currentTime = value;
};

const handleTimeLineMouseDown = () => {
  videoStatus = video.paused ? false : true;
  video.pause();
};

const handleTimeLineMouseUp = () => {
  if (videoStatus) {
    video.play();
  } else {
    video.pause();
  }
};
// Keyboard Events
const handleKeyDownEvent = (event) => {
  switch (event.code) {
    case "Space":
      handlePlayBtn();
      break;
    case "ArrowLeft":
      video.currentTime -= 1;
      break;
    case "ArrowRight":
      video.currentTime += 1;
      break;
    case "KeyM":
      handleMuteBtn();
      break;
    case "KeyF":
      handleFullScreenBtn();
      break;
  }
};
// FullScreen Btn Clicked
const handleFullScreenBtn = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};
const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    video.style.maxHeight = "900px";
    video.style.display = "flex";
    fullScreenBtnIcon.classList = "fas fa-compress";
  } else {
    video.style.maxHeight = "320px";
    video.style.removeProperty("display");
    fullScreenBtnIcon.classList = "fas fa-expand";
  }
};
const hideControllers = () => {
  videoControllers.classList.remove("showing");
  console.log("removing");
};
const showControllers = () => {
  videoControllers.classList.add("showing");
  console.log("showing");
};
const handleVideoMouseMove = () => {
  if (timeoutID) {
    clearTimeout(timeoutID);
    timeoutID = null;
  }
  showControllers();
  timeoutID = setTimeout(hideControllers, 3000);
};
const handleVideoMouseLeave = () => hideControllers();
const handleVideoClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleVidoeEnded = () => {
  video.load();
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volInput.addEventListener("input", handleInputVol);
video.addEventListener("play", handleVideoPlay);
video.addEventListener("pause", handleVideoPause);
video.addEventListener("loadedmetadata", handleVideoMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handleVideoClick);
video.addEventListener("ended", handleVidoeEnded);
videoContainer.addEventListener("mousemove", handleVideoMouseMove);
videoContainer.addEventListener("mouseleave", handleVideoMouseLeave);
timeLine.addEventListener("input", handleTimeLine);
timeLine.addEventListener("mousedown", handleTimeLineMouseDown);
timeLine.addEventListener("mouseup", handleTimeLineMouseUp);
document.addEventListener("keydown", handleKeyDownEvent);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);
videoContainer.addEventListener("fullscreenchange", handleFullScreen);
