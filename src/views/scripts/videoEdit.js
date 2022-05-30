const category = document.querySelector("#category");
const select = category.className;

for (let i = 0; i < category.options.length; i++) {
  if (category.options[i].value === select) {
    category.options[i].selected = true;
  } else {
    category.options[0].selected = true;
  }
}
