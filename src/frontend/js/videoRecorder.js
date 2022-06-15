// .mp4로 변경해주는 FFmpeg Import
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.querySelector("#recordBtn");
const previewVideo = document.querySelector("#previewVideo");

let stream;
let recorder;
let videoFile;

const files = {
  input: "ffmpegInput.webm",
  output: "ffmpegOutput.mp4",
  thumb: "thumb.jpg",
};

const downloadFFmpeg = (fileUrl, fileName) => {
  const linkA = document.createElement("a");
  linkA.href = fileUrl;
  // 다운로드 될 때 파일명 및 확장자
  linkA.download = fileName;
  document.body.appendChild(linkA);
  linkA.click();
};

const startRecording = () => {
  recordBtn.innerText = "녹화중 📸";
  recordBtn.disabled = true;
  recordBtn.removeEventListener("click", startRecording);

  recorder = new MediaRecorder(stream);

  // 5초간 녹화 시작
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);

  // 녹화 종료시 실행되는 이벤트
  recorder.ondataavailable = (event) => {
    // 비디오파일(링크) 생성
    videoFile = URL.createObjectURL(event.data);
    previewVideo.srcObject = null;
    previewVideo.src = videoFile;
    previewVideo.loop = true;
    previewVideo.play();
    // 영상 다운로드 이벤트 생성
    recordBtn.innerText = "영상 다운로드";
    recordBtn.disabled = false;
    recordBtn.addEventListener("click", downloadVideo);
  };
};
const downloadVideo = async () => {
  recordBtn.removeEventListener("click", downloadVideo);
  recordBtn.innerText = "잠시만 기다려주세요! 👀";
  recordBtn.disabled = true;
  // FFmpeg 시작
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();
  // 사용자 브라우저 메모리에 파일 생성 (이름 설정)
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  // 메모리에 있는 파일 mp4 변환 (60프레임, 이름 설정)
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  // 썸네일 생성
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  // mp4파일 가져오기 및 url 생성
  const mp4File = ffmpeg.FS("readFile", files.output);
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const mp4Url = URL.createObjectURL(mp4Blob);
  // 썸네일 가져오기 및 url 생성
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbUrl = URL.createObjectURL(thumbBlob);

  // 영상/썸네일 다운로드 활성화
  downloadFFmpeg(mp4Url, "download.mp4");
  downloadFFmpeg(thumbUrl, "thumbnail.jpg");

  // 사용자 브라우저 메모리 초기화
  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  recordBtn.innerText = "새로고침 해주세요! 📷";
  recordBtn.addEventListener("click", startRecording);
};
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  previewVideo.srcObject = stream;
  previewVideo.muted = true;
  previewVideo.play();
};
init();

recordBtn.addEventListener("click", startRecording);
