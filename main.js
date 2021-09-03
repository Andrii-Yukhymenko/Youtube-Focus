let mainRecomendation = document.querySelector("#primary"),
  watchRecomendation = document.querySelector("#secondary-inner");

let pageHref = window.location.href,
  regex = new RegExp(/watch/),
  itsVideo = regex.test(pageHref);

if (itsVideo) {
  deleteSection(watchRecomendation);
} else {
  deleteSection(mainRecomendation);
}

function deleteSection(item) {
  item.remove();
}
