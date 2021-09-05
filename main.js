// Т.к. youtube это spa, мы буем отслеживать изменения в DOM дереве

// Первоначальное получение элементов с рекомендациями, нужное для restoreSection
let notificationIcon = document.querySelector(
    ".notification-button-style-type-default"
  ),
  mainRecommendation = document.querySelector(
    ".ytd-two-column-browse-results-renderer"
  ),
  watchRecommendation = document.querySelector("#secondary-inner");

// Слежение за сообщениями
chrome.runtime.onMessage.addListener(getMessage);

// Элемент где будет проходить мутация
let target = document.querySelector("body");

// Колбэк-функция при срабатывании мутации
const mutationCallback = function () {
  // Определение и удаление колокольчика
  let notificationIcon = document.querySelector(
      ".notification-button-style-type-default"
    ),
    mainRecommendation = document.querySelector(
      ".ytd-two-column-browse-results-renderer"
    ),
    watchRecommendation = document.querySelector("#secondary-inner");

  deleteSection(notificationIcon);

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

// Проверяем включено или выключено расширение при перезагрузке страницы или первом запуске
checkStatus(localStorage.getItem("state"));

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
    checkStatus(localStorage.getItem("state"));
  } else if (request.message === "turn-off") {
    localStorage.setItem("state", "off");
    console.log("turn-off");
    checkStatus(localStorage.getItem("state"));
  }
}

// Функция которая включает и выключает слежение за мутациями (исполнительная логика)
function checkStatus(status) {
  if (status === "on") {
    observer.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  } else if (status === "off" || status === null) {
    observer.disconnect();
    restoreSection(notificationIcon);
    restoreSection(mainRecommendation);
    restoreSection(watchRecommendation);
  }
}
