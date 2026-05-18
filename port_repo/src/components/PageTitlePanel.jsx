export default function PageTitlePanel({ pageTitle, setPageTitle }) {
  return (
    <section className="rail-box title-box">
      <h2>Give title</h2>
      <input
        value={pageTitle}
        onChange={(event) => setPageTitle(event.target.value)}
        placeholder="Type page title"
      />
    </section>
  )
}
