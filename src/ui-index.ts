import { selectMenu, disclosure } from "figma-plugin-ds";
//https://github.com/thomas-lowry/figma-plugin-ds

selectMenu.init();
disclosure.init();

const reviseButton = document.getElementById("create");
if (reviseButton) {
  reviseButton.onclick = () => {
    const textbox = document.getElementById("count") as HTMLInputElement;
    const count = parseInt(textbox.value, 10);
    parent.postMessage(
      { pluginMessage: { type: "create-rectangles", count } },
      "*"
    );
  };
}

const cancelButton = document.getElementById("cancel");
if (cancelButton) {
  cancelButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };
}
