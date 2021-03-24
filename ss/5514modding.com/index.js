var locationHash = window.location.hash;
var pages = {
  "#main": "./pages/main/index.html",
  "#allmods": "./pages/allmods/index.html",
  "#support": "./pages/support/index.html",
  "#shellshock": "./pages/shellshock/index.html",
  "#1v1": "./pages/1v1/index.html",
  "#social": "./pages/social/index.html",
  "#about": "./pages/about/index.html",
  "#news": "./pages/news/index.html"
};
let pageIframe;
let highlightedPages = [];

function highlightSelectedPage(){
  // unhighlight all previous pages
  for (let i of highlightedPages){
    i.style.backgroundColor = "";
  }

  let pageId = (locationHash != "")? locationHash.substr(1, locationHash.length) : "main";
  let pageTextElement = document.getElementById(pageId);

  if (!pageTextElement){return;}

  pageTextElement.style.backgroundColor = "#7482a1";
  highlightedPages.push(pageTextElement);
}

function processIframeContainer(){
  // Delete any existing iframes
  if (pageIframe){
    pageIframe.parentNode.removeChild(pageIframe);
    pageIframe = null;
  }

  // Get the correct iframe
  if (locationHash == "" || locationHash == "#main"){
    // Check if the hash is blank or if it is for the main one
    makePageIframe(pages["#main"]);
  }else {
    // Check for all other hashes
    if (pages[locationHash]){
      // Found a good location hash, make its iframe
      makePageIframe(pages[locationHash]);
    }else {
      // Unknown hash, so set it to main and load main iframe
      window.history.pushState({}, document.title, "#main");
      locationHash = "#main";
      makePageIframe(pages["#main"]);
    }
  }

  // Highlight selected page
  highlightSelectedPage();
}

function makePageIframe(url){
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = "100%";
  iframe.height = "100%";
  document.getElementById("pageContentDiv").appendChild(iframe);
  pageIframe = iframe;
}

window.onload = function(){
  // Load initial iframe
  processIframeContainer();
}

window.onpopstate = function(){
  locationHash = window.location.hash;
  processIframeContainer();
}

function handleItemClick(item){
  let hashId = `#${item.id}`;
  let iframUrl = pages[hashId];
  if (iframUrl){
    window.history.pushState({}, document.title, hashId);
    locationHash = hashId;
    processIframeContainer();
  }else {
    console.error(`Unknown clicked item hash : ${hashId}`, item);
  }
}

// Code for the hovering animations for the main page display

let onHoverInfo = {
  timeStarted: 0,
  timeLeft: 0,
  timeout: null
}
let offHoverInfo = {
  timeStarted: 0,
  timeLeft: 0,
  timeout: null
}

function pageOnHover(){
  let currentTime = (new Date()).getTime();
  let offHoverTimeoutDone = ((currentTime - offHoverInfo.timeStarted) > offHoverInfo.timeLeft)? true : false;

  clearTimeout(offHoverInfo.timeout);
  clearTimeout(onHoverInfo.timeout);

  if (offHoverTimeoutDone){
    onHoverInfo.timeStarted = currentTime;
    onHoverInfo.timeLeft = 1000;
    onHoverInfo.timeout = setTimeout(function(){
      document.getElementById('pageContentDiv').style.visibility = "visible";
    }, 1000);
  }else {
    let offHoverRemainingTime = offHoverInfo.timeLeft - (currentTime - offHoverInfo.timeStarted);
    let timeToUse = 1000 - offHoverRemainingTime;
    onHoverInfo.timeStarted = currentTime;
    onHoverInfo.timeLeft = timeToUse;
    onHoverInfo.timeout = setTimeout(function(){
      document.getElementById('pageContentDiv').style.visibility = "visible";
    }, timeToUse);
  }
}

function pageOffHover(){
  let currentTime = (new Date()).getTime();
  let onHoverTimeoutDone = ((currentTime - onHoverInfo.timeStarted) > onHoverInfo.timeLeft)? true : false;

  clearTimeout(offHoverInfo.timeout);
  clearTimeout(onHoverInfo.timeout);

  if (onHoverTimeoutDone){
    offHoverInfo.timeStarted = currentTime;
    offHoverInfo.timeLeft = 1000;
    offHoverInfo.timeout = setTimeout(function(){
      document.getElementById('pageContentDiv').style.visibility = "hidden";
    }, 10);
  }else {
    let onHoverRemainingTime = onHoverInfo.timeLeft - (currentTime - onHoverInfo.timeStarted);
    let timeToUse = 1000 - onHoverRemainingTime;
    offHoverInfo.timeStarted = currentTime;
    offHoverInfo.timeLeft = timeToUse;
    offHoverInfo.timeout = setTimeout(function(){
      document.getElementById('pageContentDiv').style.visibility = "hidden";
    }, 10);
  }
}