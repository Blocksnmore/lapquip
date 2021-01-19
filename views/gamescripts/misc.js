function shitshow() {
  console.log("test");
  let dark = getElm("dark");
  if (dark.disabled) {
    dark.disabled = false;
  } else {
    dark.disabled = true;
  }
}
function getElm(id) {
  return document.getElementById(id);
}
