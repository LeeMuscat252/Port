export default function ComponentPalettePanel({
  sectionTypes,
  sectionLabels,
  onPaletteDragStart,
  addSection,
  children,
}) {
  return (
    <section className="rail-box components-box">
      <h2>Components</h2>
      <div className="palette-grid">
        {Object.values(sectionTypes).map((type) => (
          <button
            key={type}
            type="button"
            className="palette-item"
            draggable
            onDragStart={(event) => onPaletteDragStart(event, type)}
            onClick={() => addSection(type)}
          >
            {sectionLabels[type]}
          </button>
        ))}
      </div>
      {children}
    </section>
  )
}
