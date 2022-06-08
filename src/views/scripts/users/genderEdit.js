// User Gender Edit
const gender = document.querySelector("select");
const select = gender.id ? gender.id : null;
if (select) {
  for (let i = 0; i < gender.options.length; i++) {
    if (gender.options[i].value === select) {
      gender.options[i].selected = true;
      break;
    } else {
      gender.options[0].selected = true;
    }
  }
} else {
  gender.options[0].selected = true;
}
