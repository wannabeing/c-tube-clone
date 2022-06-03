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
