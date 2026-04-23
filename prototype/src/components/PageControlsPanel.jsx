export default function PageControlsPanel({
  pages,
  activePageId,
  selectPage,
  pageName,
  renameActivePage,
  addPage,
  duplicateActivePage,
  activePage,
  deleteActivePage,
}) {
  return (
    <section className="rail-box page-box">
      <h2>Pages</h2>
      <div className="page-list">
        {pages.map((page) => (
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
      <div className="button-row compact">
        <button type="button" onClick={addPage}>
          New Page
        </button>
        <button type="button" onClick={duplicateActivePage} disabled={!activePage}>
          Duplicate
        </button>
        <button type="button" onClick={deleteActivePage} disabled={pages.length <= 1}>
          Delete
        </button>
      </div>
    </section>
  )
}
