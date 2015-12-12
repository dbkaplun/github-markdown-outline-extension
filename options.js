(function (root) {
  var STATUS_SHOW_MS = 2000
  var document = root.document

  document.addEventListener('DOMContentLoaded', function () {
    var $useInnerHTML = document.querySelector('[name="useInnerHTML"]')
    var $fixed = document.querySelector('[name="fixed"]')
    var $status = document.querySelector('#status')
    var initStatusTextContent = $status.textContent
    var statusShowTimeout

    function saveOptions () {
      chrome.storage.sync.set({
        useInnerHTML: $useInnerHTML.checked,
        fixed: $fixed.checked
      }, function () {
        $status.textContent = "Options saved."
        if (statusShowTimeout) clearTimeout(statusShowTimeout)
        statusShowTimeout = setTimeout(function () { $status.textContent = initStatusTextContent }, STATUS_SHOW_MS)
      })
    }

    function restoreOptions () {
      chrome.storage.sync.get({
        // default values
        useInnerHTML: true,
        fixed: true
      }, function (options) {
        $useInnerHTML.checked = options.useInnerHTML
        $fixed.checked = options.fixed
      })
    }

    [$useInnerHTML, $fixed].forEach(function ($input) {
      $input.addEventListener('change', function (evt) { saveOptions() })
    })

    restoreOptions()
  })
}(this))
