const field_name = document.querySelector(".field-name");
const field_password = document.querySelector(".field-password");
const fieldIcon_name = document.querySelector(".fieldIcon-name");
const fieldIcon_password = document.querySelector(".fieldIcon-password");
const submit = document.querySelector(".submit");

field_name.disabled = true;
field_password.disabled = true;
submit.disabled = true;
let a = 0;
let b = 0;
fieldIcon_name.addEventListener("click", () => {
  field_name.disabled = false;
  a = 1;
  if (b === 1) {
    submit.disabled = false;
  }
});
fieldIcon_password.addEventListener("click", () => {
  field_password.disabled = false;
  b = 1;
  if (a === 1) {
    submit.disabled = false;
  }
});
