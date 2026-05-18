export default function PageControlsPanel({
  pages,
  activePageId,
  selectPage,
  pageName,
  renameActivePage,
}) {
  const visiblePages = pages.filter((page) => page.name !== 'About Us')

  return (
    <section className="rail-box page-box">
      <h2>Pages</h2>
      <div className="page-list">
        {visiblePages.map((page) => (
          <button
            key={page.id}
            type="button"
            className={`page-item ${page.id === activePageId ? 'active' : ''}`}
            onClick={() => selectPage(page.id)}
          >
            {page.name}
          </button>
        ))}
      </div>
      <label>
        Page Name
        <input value={pageName} onChange={(event) => renameActivePage(event.target.value)} />
      </label>
    </section>
  )
}
