const likesBtn = document.querySelector("#likesBtn");

const handleLikes = async (event) => {
  event.preventDefault();
  const videoContainer = document.querySelector("#videoContainer");
  const videoID = videoContainer.dataset.video_id;

  const response = await fetch(`/api/videos/${videoID}/likes`, {
    method: "POST",
  });

  if (response.status === 200) {
    window.location.replace(`${videoID}`);
  }
};

// 로그인 했지만 비디오 작성자는 좋아요를 누를 수 없다
if (likesBtn) {
  likesBtn.addEventListener("click", handleLikes);
}
