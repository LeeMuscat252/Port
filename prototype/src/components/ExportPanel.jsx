export default function ExportPanel({
  exportHtml,
}) {
  return (
    <section className="rail-box export-box">
      <h2>Export</h2>
      <button type="button" onClick={exportHtml}>
        Export HTML
      </button>
    </section>
  )
}
