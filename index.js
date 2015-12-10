(function (root) {
  var USE_INNERHTML = true

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
  var linkSel = 'a[id]'

  toArray(document.querySelectorAll('.markdown-body')).forEach(function ($md) {
    var $outline = $md.insertBefore(document.createElement('ul'), $md.firstElementChild)
    toArray($md.querySelectorAll(headerSel)).forEach(function ($h) {
      var level = getHeaderLevel($h)
      if (!level) return
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
      if (USE_INNERHTML) {
        $topic.innerHTML = $h.innerHTML
        $child = $topic.querySelector(linkSel)
        if ($child) $topic.removeChild($child)
      } else {
        $topic.innerText = $h.innerText
      }
      $topic.href = '#'+$h.querySelector(linkSel).id
    })
  })
}(this))
