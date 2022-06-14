// Video Category Edit
const category = document.querySelector("#category");
const select = category.dataset.gender;

for (let i = 0; i < category.options.length; i++) {
  if (category.options[i].value === select) {
    category.options[i].selected = true;
    break;
  }
}
