// User Gender Edit
const gender = document.querySelector("#gender");
const select = gender.className ? gender.className : null;
if (select) {
  for (let i = 0; i < gender.options.length; i++) {
    if (gender.options[i].value === select) {
      gender.options[i].selected = true;
    } else {
      gender.options[0].selected = true;
    }
  }
} else {
  gender.options[0].selected = true;
}

// User Avatar Image src
const img = document.querySelector("img");
const src = img.id;
if (src.search("http")) {
  const newSrc = src.slice(1);
  img.src = newSrc;
} else {
  img.src = src;
}
