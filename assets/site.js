(() => {
  const canvas = document.querySelector("#signal-field")
  const year = document.querySelector("#year")

  if (year) year.textContent = String(new Date().getFullYear())
  if (!canvas) return

  const context = canvas.getContext("2d")
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const links = document.querySelectorAll("[data-signal-key]")
  const nodes = [
    { key: "systems", x: 0.78, y: 0.18, phase: 0.1 },
    { key: "agents", x: 0.88, y: 0.34, phase: 1.4 },
    { key: "research", x: 0.68, y: 0.42, phase: 2.8 },
    { key: "orbit", x: 0.82, y: 0.56, phase: 3.7 },
    { key: "writing", x: 0.7, y: 0.74, phase: 4.9 },
    { key: "people", x: 0.52, y: 0.22, phase: 2.1 },
    { key: "archive", x: 0.91, y: 0.77, phase: 5.6 },
  ]
  const edges = [
    ["systems", "agents"],
    ["systems", "research"],
    ["systems", "people"],
    ["agents", "orbit"],
    ["research", "writing"],
    ["writing", "archive"],
    ["orbit", "archive"],
  ]

  let activeKey = null
  let frame = 0
  let width = 0
  let height = 0
  let pixelRatio = 1
  const pointer = { x: 0.5, y: 0.5 }

  function resize() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    draw(0)
  }

  function position(node, time) {
    const movement = reducedMotion ? 0 : Math.sin(time * 0.0005 + node.phase) * 11
    const pointerPull = activeKey === node.key ? 18 : 0
    return {
      x: node.x * width + movement + (pointer.x - 0.5) * pointerPull,
      y: node.y * height + Math.cos(time * 0.00043 + node.phase) * 9 + (pointer.y - 0.5) * pointerPull,
    }
  }

  function draw(time) {
    context.clearRect(0, 0, width, height)
    const locations = new Map(nodes.map((node) => [node.key, position(node, time)]))

    for (const [from, to] of edges) {
      const first = locations.get(from)
      const second = locations.get(to)
      const connected = activeKey === from || activeKey === to
      context.beginPath()
      context.moveTo(first.x, first.y)
      context.lineTo(second.x, second.y)
      context.strokeStyle = connected ? "rgba(184, 247, 213, 0.32)" : "rgba(184, 247, 213, 0.075)"
      context.lineWidth = connected ? 1.15 : 0.7
      context.stroke()
    }

    for (const node of nodes) {
      const point = locations.get(node.key)
      const selected = activeKey === node.key
      context.beginPath()
      context.arc(point.x, point.y, selected ? 4.2 : 2.2, 0, Math.PI * 2)
      context.fillStyle = selected ? "#e1fff0" : "rgba(184, 247, 213, 0.48)"
      context.fill()

      if (selected) {
        context.beginPath()
        context.arc(point.x, point.y, 13, 0, Math.PI * 2)
        context.strokeStyle = "rgba(184, 247, 213, 0.25)"
        context.stroke()
      }
    }

    if (!reducedMotion) frame = window.requestAnimationFrame(draw)
  }

  function setActive(key) {
    activeKey = key
    if (reducedMotion) draw(0)
  }

  links.forEach((link) => {
    const key = link.dataset.signalKey
    link.addEventListener("pointerenter", () => setActive(key))
    link.addEventListener("focus", () => setActive(key))
    link.addEventListener("pointerleave", () => setActive(null))
    link.addEventListener("blur", () => setActive(null))
  })

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / width
    pointer.y = event.clientY / height
  }, { passive: true })
  window.addEventListener("resize", resize, { passive: true })

  resize()
  if (!reducedMotion) frame = window.requestAnimationFrame(draw)

  window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame), { once: true })
})()
