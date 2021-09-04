let button = document.querySelector(".button");

button.addEventListener("click", () => {
  if (button.classList.contains("active")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: "turn-off" });
      button.classList.remove("active");
      button.innerText = "Включить";
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: "turn-on" });
      button.classList.add("active");
      button.innerText = "Выключить";
    });
  }
});
