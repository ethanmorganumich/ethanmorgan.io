(() => {
  const list = document.querySelector("#notes-list")
  const count = document.querySelector("#note-count")
  const error = document.querySelector("#notes-error")
  const year = document.querySelector("#year")

  if (year) year.textContent = String(new Date().getFullYear())
  if (!list || !count || !error) return

  function labelFor(note, slug) {
    if (note.tags?.length) return note.tags.join(" · ").toUpperCase()
    return (slug.split("/")[0] || "NOTE").replace(/-/g, " ").toUpperCase()
  }

  function summaryFor(content) {
    const normalized = content.replace(/\s+/g, " ").trim()
    return normalized.length > 176 ? `${normalized.slice(0, 173).trimEnd()}...` : normalized
  }

  function dateFor(date) {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(date))
  }

  fetch("./static/writingIndex.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load the note index")
      return response.json()
    })
    .then((entries) => {
      count.textContent = `${entries.length} PUBLIC NOTES`

      for (const note of entries) {
        const { slug } = note
        const item = document.createElement("li")
        item.className = "note"

        const link = document.createElement("a")
        link.href = `./${encodeURI(slug)}.html`

        const title = document.createElement("span")
        title.className = "note-title"
        title.textContent = note.title || slug
        link.append(title)

        const summary = summaryFor(note.content || "")
        const copy = document.createElement("div")
        copy.append(link)
        if (summary) {
          const paragraph = document.createElement("p")
          paragraph.className = "note-summary"
          paragraph.textContent = summary
          copy.append(paragraph)
        }

        const meta = document.createElement("span")
        meta.className = "note-meta"
        meta.textContent = [labelFor(note, slug), dateFor(note.date)].filter(Boolean).join(" · ")

        item.append(copy, meta)
        list.append(item)
      }
    })
    .catch(() => {
      error.hidden = false
    })
})()
