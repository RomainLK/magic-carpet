function addRestore(name, payload) {
  console.log(name, payload)
  const button = document.createElement('li')
  button.className += 'list-group-item list-group-item-action'
  button.textContent = name
  button.addEventListener('click', e => {
    // Weird issue when trying to extract the next few lines in function.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { from: 'magicCarpetPopup', action: 'restoreState', payload })
    })
  })

  const remove = document.createElement('div')
  remove.textContent = 'x'
  remove.className = 'float-right btn btn-danger'
  button.appendChild(remove)
  remove.addEventListener('click', e => {
    chrome.storage.local.remove(name)
    button.remove()
  }, { once: true })
  document.getElementById('restoreButtons').appendChild(button)
}


chrome.storage.local.get(data => {
  console.log(data)
  for (const key in data) {
    addRestore(key, data[key])
  }
})

document.getElementById('formName').addEventListener('submit', e => {
  console.log('Saving')
  e.preventDefault()
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { from: 'magicCarpetPopup', action: 'saveState' },
      function (response) {
        const name = document.getElementById('nameInput').value || response.payload.route
        console.log(name)
        chrome.storage.local.set({ [name]: response.payload }, function () {
          console.log('Saved ', name)
        })
      })
  })
})


chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log('change', changes)
  for (const key in changes) {
    if(changes[key].newValue){
      addRestore(key, changes[key].newValue)
    }
  }
})


