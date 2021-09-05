let button = document.querySelector(".button");

if (
  localStorage.getItem("state") === "on" ||
  localStorage.getItem("state") === null
) {
  button.classList.remove("active");
  button.innerText = "Выключить";
} else {
  button.classList.add("active");
  button.innerText = "Включить";
}
//todo обдумать когда какое значение state переключать
button.addEventListener("click", () => {
  if (
    localStorage.getItem("state") === "on" ||
    localStorage.getItem("state") === null
  ) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: "turn-off" });
      button.classList.remove("active");
      button.innerText = "Включить";
      localStorage.setItem("state", "off");
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: "turn-on" });
      button.classList.add("active");
      button.innerText = "Выключить";
      localStorage.setItem("state", "on");
    });
  }
});
