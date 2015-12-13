(function (root) {
  var STATUS_SHOW_MS = 2000
  var document = root.document

  document.addEventListener('DOMContentLoaded', function () {
    var $useInnerHTML = document.querySelector('[name="useInnerHTML"]')
    var $fixed = document.querySelector('[name="fixed"]')
    var $hideIfOutlineDetected = document.querySelector('[name="hideIfOutlineDetected"]')
    var $status = document.querySelector('#status')
    var initStatusTextContent = $status.textContent
    var statusShowTimeout

    function saveOptions () {
      chrome.storage.sync.set({
        useInnerHTML: $useInnerHTML.checked,
        fixed: $fixed.checked,
        hideIfOutlineDetected: $hideIfOutlineDetected.checked
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
        fixed: true,
        hideIfOutlineDetected: true
      }, function (options) {
        $useInnerHTML.checked = options.useInnerHTML
        $fixed.checked = options.fixed
        $hideIfOutlineDetected.checked = options.hideIfOutlineDetected
      })
    }

    [$useInnerHTML, $fixed, $hideIfOutlineDetected].forEach(function ($input) {
      $input.addEventListener('change', function (evt) { saveOptions() })
    })

    restoreOptions()
  })
}(this))
