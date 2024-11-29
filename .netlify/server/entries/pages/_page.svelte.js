import { S as pop, Q as push } from "../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<main class="svelte-13avv6a"><h1>Take a Photo</h1> <input type="file" accept="image/*" capture="camera"> <button>Upload Photo</button></main>`;
  pop();
}
export {
  _page as default
};
