const s = document.createElement('script');
const id = document.createElement('div')
id.textContent = chrome.runtime.id
id.style='display:none;'
id.id='magicCarpet'
s.src = chrome.runtime.getURL('injected.js');

document.body.appendChild(id);

(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.remove();
};

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.nuxt);    
  }
  }, false);


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    const responseListener = event => {
      if (event.source != window)
        return;
      const message = event.data
      if (message.from === 'magicCarpetInjected') {
        window.removeEventListener('message', responseListener)
        sendResponse(message)
        return
      }
    }

    window.addEventListener('message', responseListener)
    window.postMessage(request, '*')

    return true
  });
