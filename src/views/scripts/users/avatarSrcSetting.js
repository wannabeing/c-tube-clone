// User Avatar Image src
const img = document.querySelector("img");
console.log("zz");
if (img) {
  const src = img.id;
  if (src.search("http")) {
    const newSrc = src.slice(1);
    img.src = newSrc;
  } else {
    img.src = src;
  }
}
