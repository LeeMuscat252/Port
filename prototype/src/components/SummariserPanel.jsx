export default function SummariserPanel({
  inputText,
  setInputText,
  processWithAi,
  isProcessing,
  aiError,
  aiOutput,
  setAiOutput,
  addAiOutputAsSection,
}) {
  return (
    <section className="rail-box summariser-box">
      <h2>Summariser</h2>
      <textarea
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="Paste long text here"
      />
      <div className="button-row compact">
        <button type="button" onClick={() => processWithAi('summarize')} disabled={isProcessing}>
          Summarise
        </button>
        <button type="button" onClick={() => processWithAi('simplify')} disabled={isProcessing}>
          Simplify
        </button>
      </div>
      {aiError && <p className="error-text">{aiError}</p>}
      <textarea
        value={aiOutput}
        onChange={(event) => setAiOutput(event.target.value)}
        placeholder="AI output"
      />
      <button type="button" onClick={addAiOutputAsSection} disabled={!aiOutput}>
        Add To Preview
      </button>
    </section>
  )
}
