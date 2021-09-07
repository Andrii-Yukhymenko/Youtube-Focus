// Т.к. youtube это spa, мы буем отслеживать изменения в DOM дереве

// Элемент где будет проходить мутация
let target = document.querySelector("body");

// Слежение за сообщениями
chrome.runtime.onMessage.addListener(getMessage);

// Слежение за мутациями, при каждом изменении проверяем статус
const observer = new MutationObserver(() => {
  console.log(`Working... Hiding status: ${localStorage.getItem("state")}`);
  if (localStorage.getItem("state") === "on") {
    hideRecommendation();
  } else if (
    localStorage.getItem("state") === "off" ||
    localStorage.getItem("state") === null
  ) {
    showRecommendation();
  }
});

// Включаем слежение за мутациями
observer.observe(target, {
  attributes: true,
  childList: true,
  subtree: true,
});

//
//
//
//
//
//
// Функции =============================================================================================================

// Функция для удаления элемента
function deleteSection(item) {
  if (item != null) {
    item.style.display = "none";
  }
}
// Функция для восстановления элемента
function restoreSection(item) {
  if (item != null) {
    item.style.display = "block";
  }
}

// Функция определения страницы с плеером
function defineVideoPage() {
  let pageHref = window.location.href,
    regexVideo = new RegExp(/watch/),
    itsVideo = regexVideo.test(pageHref);
  return itsVideo;
}
// Функция определения страницы с результатами поиска
function defineResultsPage() {
  let pageHref = window.location.href,
    regexResults = new RegExp(/results/),
    itsResults = regexResults.test(pageHref);
  return itsResults;
}

// todo отключить блок подписок, трендов
// todo вместо удаления целого блока рекомендаций на главной странице можно поместить внутрь картинку с мотивацией.

// Функция получения сообщения и записи значения в localStorage
function getMessage(request, sender, sendResponse) {
  if (request.message === "turn-on") {
    localStorage.setItem("state", "on");
    console.log("turn-on");
  } else if (request.message === "turn-off") {
    localStorage.setItem("state", "off");
    console.log("turn-off");
  }
}

// Функция колбек, срабатывает когда state = on
function hideRecommendation() {
  let notificationIcon = document.querySelector(
      ".notification-button-style-type-default"
    ),
    mainRecommendation = document.querySelector(
      ".ytd-two-column-browse-results-renderer"
    ),
    watchRecommendation = document.querySelector("#secondary-inner > #related");

  //Определение ссылки и на какой странице мы находимся
  if (defineVideoPage()) {
    deleteSection(watchRecommendation);
  } else if (defineResultsPage()) {
  } else {
    deleteSection(mainRecommendation);
  }
  deleteSection(notificationIcon);
}

// Функция колбек, срабатывает когда state = off или null
function showRecommendation() {
  let notificationIcon = document.querySelector(
      ".notification-button-style-type-default"
    ),
    mainRecommendation = document.querySelector(
      ".ytd-two-column-browse-results-renderer"
    ),
    watchRecommendation = document.querySelector("#secondary-inner > #related");
  restoreSection(notificationIcon);
  restoreSection(mainRecommendation);
  restoreSection(watchRecommendation);
}
