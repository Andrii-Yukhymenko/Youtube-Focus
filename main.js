// Т.к. youtube это spa, мы буем отслеживать изменения в DOM дереве

chrome.runtime.onMessage.addListener(getMessage);

// Элемент где будет проходить мутация
let target = document.querySelector("body");

// Колбэк-функция при срабатывании мутации
const mutationCallback = function (mutationsList, observer) {
  // Определение и удаление колокольчика
  let notificationIcon = document.querySelector(
    ".notification-button-style-type-default"
  );
  deleteSection(notificationIcon);

  // Определение блоков с рекомендациями
  let mainRecommendation = document.querySelector(
      ".ytd-two-column-browse-results-renderer"
    ),
    watchRecommendation = document.querySelector("#secondary-inner");

  //Определение ссылки и на какой странице мы находимся
  //todo если активировать плагин на странице подписок и перезагрузить страницу то если потом перейти на главную страницу блок с рекомендациями будет отображаться
  if (defineVideoPage()) {
    deleteSection(watchRecommendation);
  } else if (defineResultsPage()) {
  } else {
    deleteSection(mainRecommendation);
  }
};

// Создаём экземпляр наблюдателя с указанной функцией колбэка
const observer = new MutationObserver(mutationCallback);

// Начинаем наблюдение за настроенными изменениями целевого элемента

// Функция для удаления элемента
function deleteSection(item) {
  if (item != null) {
    item.style.display = "none";
  }
}
function restoreSection(item) {
  if (item != null) {
    item.style.display = "block";
  }
}


function defineVideoPage() {
  let pageHref = window.location.href,
    regexVideo = new RegExp(/watch/),
    itsVideo = regexVideo.test(pageHref);
  return itsVideo;
}

function defineResultsPage() {
  let pageHref = window.location.href,
    regexResults = new RegExp(/results/),
    itsResults = regexResults.test(pageHref);
  return itsResults;
}

// todo отключить блок подписок, трендов
// todo вместо удаления целого блока рекомендаций на главной странице можно поместить внутрь картинку с мотивацией.

function getMessage(request, sender, sendResponse) {
  if (request.message === "turn-on") {
    localStorage.setItem("state", "on");
    let extantionIsOn = true;
    console.log("turn-on");
    observer.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return extantionIsOn;
  } else if (request.message === "turn-off") {
    localStorage.setItem("state", "off");
    let extantionIsOn = false;
    console.log("turn-off");
    observer.disconnect();
    return extantionIsOn;
  }
}
