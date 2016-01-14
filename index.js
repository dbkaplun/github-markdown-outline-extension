(root => {
  var document = root.document

  getHeaderLevel.REGEXP = /h(\d)/i
  function getHeaderLevel ($h) {
    var level = Number(((($h || {}).tagName || '').match(getHeaderLevel.REGEXP) || [])[1])
    return isNaN(level) ? undefined : level
  }

  var headerSels = []
  for (var l = 1; l <= 6; l++) headerSels.push('h'+l)
  var headerSel = headerSels.join(', ')
  var anchorSel = 'a[id]'
  var linkSel = 'a[href^="#"]:not(.anchor)'

  root.chrome.storage.sync.get({
    // default values
    hideIfOutlineDetected: true,
    float: false,
    useInnerHTML: true
  }, options => {
    Array.from(document.querySelectorAll('.markdown-body')).forEach($md => {
      var $headers = Array.from($md.querySelectorAll(headerSel))

      if (options.hideIfOutlineDetected && $md.querySelectorAll(linkSel).length * 2 >= $headers.length) return // there's already an outline in the document

      var $container = document.createElement('div')
      $container.classList.add('__github-markdown-outline-container')
      if (options.float) $container.classList.add('__github-markdown-outline-container--float')

      var $outline = document.createElement('ul')
      $outline.classList.add('__github-markdown-outline')
      $container.appendChild($outline)

      // generate outline from headers
      $headers.forEach($h => {
        var level = getHeaderLevel($h)
        if (!level) return
        var $ul = $outline, $li, $child
        for (var l = 1; l < level; l++) {
          $li = $ul.lastChild || $ul.appendChild(document.createElement('li'))
          $child = $li.lastChild || {}
          $ul = $child.tagName === 'UL'
            ? $child
            : $li.appendChild(document.createElement('ul'))
        }
        var $topic = $ul
          .appendChild(document.createElement('li'))
          .appendChild(document.createElement('a'))
        if (options.useInnerHTML) {
          $topic.innerHTML = $h.innerHTML
          Array.from($topic.querySelectorAll(anchorSel)).forEach($child => {
            $child.parentNode.removeChild($child)
          })
        } else {
          $topic.innerText = $h.innerText
        }
        $topic.href = `#${$h.querySelector(anchorSel).id}`
      })

      // find all sublists with one item and replace with contents
      Array.from($container.querySelectorAll('ul')).forEach($ul => {
        var $parent = $ul.parentNode
        var $li = $ul.firstChild
        var $child = $li.firstChild
        if ($li !== $ul.lastChild || $child.tagName !== 'UL') return
        while ($child) {
          $parent.insertBefore($child, $ul.nextSibling) // inserts to end of list if $ul.nextSibling is null
          $child = $child.nextSibling
        }
        $parent.removeChild($ul)
      })

      $md.insertBefore($container, $md.firstChild)
    })
  })
})(this)
