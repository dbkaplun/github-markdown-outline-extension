(function (root) {
  var STATUS_SHOW_MS = 2000
  var document = root.document

  document.addEventListener('DOMContentLoaded', function () {
    var $useInnerHTML = document.querySelector('[name="useInnerHTML"]')
    var $status = document.querySelector('#status')
    var initStatusTextContent = $status.textContent
    var timeout

    function saveOptions () {
      var useInnerHTML = $useInnerHTML.checked
      chrome.storage.sync.set({
        useInnerHTML: useInnerHTML
      }, function () {
        $status.textContent = "Options saved."
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(function () { $status.textContent = initStatusTextContent }, STATUS_SHOW_MS)
      })
    }

    function restoreOptions () {
      chrome.storage.sync.get({
        // default values
        useInnerHTML: true
      }, function (options) {
        $useInnerHTML.checked = options.useInnerHTML
      })
    }

    $useInnerHTML.addEventListener('change', function (evt) { saveOptions() })
    restoreOptions()
  })
}(this))
