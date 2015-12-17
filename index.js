(function (root) {
  var document = root.document

  function toArray (nodeList) {
    return [].slice.call(nodeList)
  }

  getHeaderLevel.REGEXP = /h(\d)/i
  function getHeaderLevel ($h) {
    var level = Number(((($h || {}).tagName || '').match(getHeaderLevel.REGEXP) || [])[1])
    return isNaN(level) ? undefined : level
  }

  var headerSels = []
  for (var l = 1; l <= 6; l++) headerSels.push('h'+l)
  var headerSel = headerSels.join(', ')
  var anchorSel = 'a[id]'
  var linkSel = 'a[href^="#"]'

  root.chrome.storage.sync.get({
    // default values
    hideIfOutlineDetected: true,
    float: true,
    useInnerHTML: true,
    normalize: true
  }, function (options) {
    toArray(document.querySelectorAll('.markdown-body')).forEach(function ($md) {
      var $headers = toArray($md.querySelectorAll(headerSel))

      if (options.hideIfOutlineDetected && toArray($md.querySelectorAll('p,ul')).some(function ($parent) {
        return $parent.querySelectorAll(linkSel).length * 2 >= $headers.length
      })) return // there's already an outline in the document

      var $outline = document.createElement('ul')
      $outline.classList.add('__github-markdown-outline')
      if (options.float) $outline.classList.add('__github-markdown-outline--float')
      var lastLevel = 1
      $headers.forEach(function ($h) {
        var level = getHeaderLevel($h)
        if (!level) return
        if (options.normalize) level = Math.min(level, lastLevel + 1)
        var $ul = $outline, $li, $child
        for (var l = 1; l < level; l++) {
          $li = $ul.lastElementChild || $ul.appendChild(document.createElement('li'))
          $child = $li.lastElementChild || {}
          $ul = $child.tagName === 'UL'
            ? $child
            : $li.appendChild(document.createElement('ul'))
        }
        var $topic = $ul
          .appendChild(document.createElement('li'))
          .appendChild(document.createElement('a'))
        if (options.useInnerHTML) {
          $topic.innerHTML = $h.innerHTML
          $child = $topic.querySelector(anchorSel)
          if ($child) $topic.removeChild($child)
        } else {
          $topic.innerText = $h.innerText
        }
        $topic.href = '#'+$h.querySelector(anchorSel).id
        lastLevel = level
      })
      $md.insertBefore($outline, $md.firstElementChild)
    })
  })
}(this))
