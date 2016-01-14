(root => {
  var STATUS_SHOW_MS = 2000
  var document = root.document

  document.addEventListener('DOMContentLoaded', () => {
    var $useInnerHTML = document.querySelector('[name="useInnerHTML"]')
    var $float = document.querySelector('[name="float"]')
    var $hideIfOutlineDetected = document.querySelector('[name="hideIfOutlineDetected"]')
    var $status = document.querySelector('#status')
    var initStatusTextContent = $status.textContent
    var statusShowTimeout

    function saveOptions () {
      chrome.storage.sync.set({
        useInnerHTML: $useInnerHTML.checked,
        float: $float.checked,
        hideIfOutlineDetected: $hideIfOutlineDetected.checked
      }, () => {
        $status.textContent = "Options saved."
        if (statusShowTimeout) clearTimeout(statusShowTimeout)
        statusShowTimeout = setTimeout(() => { $status.textContent = initStatusTextContent }, STATUS_SHOW_MS)
      })
    }

    function restoreOptions () {
      chrome.storage.sync.get({
        // default values
        useInnerHTML: true,
        float: false,
        hideIfOutlineDetected: true
      }, options => {
        $useInnerHTML.checked = options.useInnerHTML
        $float.checked = options.float
        $hideIfOutlineDetected.checked = options.hideIfOutlineDetected
      })
    }

    [$useInnerHTML, $float, $hideIfOutlineDetected].forEach($input => {
      $input.addEventListener('change', evt => { saveOptions() })
    })

    restoreOptions()
  })
})(this)
