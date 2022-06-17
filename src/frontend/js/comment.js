const videoContainer = document.querySelector("#videoContainer");
const form = document.querySelector("#commentForm");
const textarea = form.querySelector("textarea");

const handleComment = async (event) => {
  event.preventDefault();
  const comment = textarea.value.trim();
  const videoID = videoContainer.dataset.video_id;

  // 공백 댓글 방지 정규표현식
  if (comment.replace(/\s|  /gi, "").length == 0) {
    textarea.value = "";
    textarea.focus();
  }
  if (comment === "") {
    return;
  }
  // 서버로 댓글 전송 (fetch)
  const response = await fetch(`/api/videos/${videoID}/comment`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      comment,
    }),
  });
  // 성공적으로 댓글을 DB에 생성
  if (response.status === 201) {
    textarea.value = "";
    textarea.focus();
    window.location.reload();
  }
};

form.addEventListener("submit", handleComment);
