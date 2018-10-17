
function sendResponse(payload) {
  window.postMessage({ from: 'magicCarpetInjected', payload }, '*');
}

window.addEventListener("message", function (event) {
  if (event.source != window)
    return;

  const message = event.data

  if (message.from === 'magicCarpetPopup') {
    switch (message.action) {
      case 'saveState':
        sendResponse({ state: JSON.stringify($nuxt.$store.state), route: $nuxt.$route.path })
        break
      case 'restoreState':
        console.log('Restoring', message.payload.route)
        const state = JSON.parse(message.payload.state)

        $nuxt.$store.replaceState(state)
        $nuxt.$router.push(message.payload.route)        
        break
        break
    }
  }
})



