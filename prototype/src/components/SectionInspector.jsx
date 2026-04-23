import NavigationSectionEditor from './NavigationSectionEditor'

export default function SectionInspector({
  sectionTypes,
  sectionLabels,
  activeSection,
  activeFloatingButton,
  activeFloatingText,
  activeFloatingImage,
  activeNavigationLinks,
  activeNestedItem,
  activeNestedItemId,
  imageInputRef,
  nestedImageInputRef,
  patchSection,
  addNestedItemToBlock,
  updateNestedItemSelection,
  moveNestedItemInBlock,
  removeNestedItemFromBlock,
  patchNestedItem,
  handleImageFile,
  patchFloatingButton,
  setFloatingButtons,
  setActiveFloatingButtonId,
  patchFloatingText,
  setFloatingTexts,
  setActiveFloatingTextId,
  patchFloatingImage,
  setFloatingImages,
  setActiveFloatingImageId,
  handleFloatingImageFile,
  addNavigationLink,
  updateNavigationLink,
  removeNavigationLink,
  handleNavigationLogoFile,
  removeSection,
}) {
  if (!(activeSection || activeFloatingButton || activeFloatingText || activeFloatingImage)) {
    return null
  }

  return (
    <div className="inspector">
      <h3>
        Edit:{' '}
        {activeFloatingButton
          ? 'Button'
          : activeFloatingText
            ? 'Text Box'
            : activeFloatingImage
              ? 'Image'
              : sectionLabels[activeSection.type]}
      </h3>

      {activeSection && activeSection.type === sectionTypes.HEADER && (
        <>
          <label>
            Heading
            <input
              value={activeSection.title}
              onChange={(event) =>
                patchSection(activeSection.id, { title: event.target.value })
              }
            />
          </label>
          <label>
            Subheading
            <textarea
              value={activeSection.subtitle}
              onChange={(event) =>
                patchSection(activeSection.id, { subtitle: event.target.value })
              }
            />
          </label>
        </>
      )}

      {activeSection && activeSection.type === sectionTypes.TEXT && (
        <label>
          Paragraph
          <textarea
            value={activeSection.text}
            onChange={(event) =>
              patchSection(activeSection.id, { text: event.target.value })
            }
          />
        </label>
      )}

      {activeSection &&
        (activeSection.type === sectionTypes.HEADER ||
          activeSection.type === sectionTypes.TEXT ||
          activeSection.type === sectionTypes.BLOCK ||
          activeSection.type === sectionTypes.BUTTON ||
          activeSection.type === sectionTypes.NAVIGATION ||
          activeSection.type === sectionTypes.FOOTER) && (
          <label>
            Alignment
            <select
              value={activeSection.align || 'left'}
              onChange={(event) =>
                patchSection(activeSection.id, { align: event.target.value })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
        )}

      {activeSection && activeSection.type === sectionTypes.IMAGE && (
        <>
          <label>
            Image URL
            <input
              value={activeSection.src}
              onChange={(event) =>
                patchSection(activeSection.id, { src: event.target.value })
              }
            />
          </label>
          <label>
            Alt Text
            <input
              value={activeSection.alt}
              onChange={(event) =>
                patchSection(activeSection.id, { alt: event.target.value })
              }
            />
          </label>
          <label>
            Caption
            <textarea
              value={activeSection.caption}
              onChange={(event) =>
                patchSection(activeSection.id, { caption: event.target.value })
              }
            />
          </label>
          <label>
            Width (%)
            <input
              type="number"
              min="10"
              max="100"
              value={activeSection.width || 100}
              onChange={(event) =>
                patchSection(activeSection.id, { width: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Height (px)
            <input
              type="number"
              min="60"
              max="900"
              value={activeSection.height || 260}
              onChange={(event) =>
                patchSection(activeSection.id, { height: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Position
            <select
              value={activeSection.position || 'center'}
              onChange={(event) =>
                patchSection(activeSection.id, { position: event.target.value })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label>
            Replace Image File
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleImageFile(activeSection.id, event.target.files?.[0], false)
              }
            />
          </label>
          <button
            type="button"
            onClick={() =>
              patchSection(activeSection.id, {
                src: '',
                alt: '',
                caption: '',
              })
            }
          >
            Clear Image
          </button>
        </>
      )}

      {activeSection && activeSection.type === sectionTypes.BLOCK && (
        <>
          <label>
            Block Title
            <input
              value={activeSection.title}
              onChange={(event) =>
                patchSection(activeSection.id, { title: event.target.value })
              }
            />
          </label>
          <label>
            Block Body
            <textarea
              value={activeSection.body}
              onChange={(event) =>
                patchSection(activeSection.id, { body: event.target.value })
              }
            />
          </label>

          <div className="nested-editor-panel">
            <div className="nested-editor-actions">
              <button type="button" onClick={() => addNestedItemToBlock(activeSection.id, sectionTypes.TEXT)}>
                Add Text Box
              </button>
              <button type="button" onClick={() => addNestedItemToBlock(activeSection.id, sectionTypes.IMAGE)}>
                Add Image
              </button>
            </div>

            <div className="nested-item-list">
              {(activeSection.nestedItems || []).map((item, itemIndex) => (
                <div
                  key={item.id}
                  className={`nested-item-row ${activeNestedItemId === item.id ? 'active' : ''}`}
                  onClick={() => updateNestedItemSelection(activeSection.id, item.id)}
                >
                  <button type="button" className="nested-item-row-label">
                    {itemIndex + 1}. {item.type === sectionTypes.TEXT ? 'Text Box' : 'Image'}
                  </button>
                  <span className="nested-item-row-actions">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        moveNestedItemInBlock(activeSection.id, item.id, -1)
                      }}
                      disabled={itemIndex === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        moveNestedItemInBlock(activeSection.id, item.id, 1)
                      }}
                      disabled={itemIndex === (activeSection.nestedItems || []).length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        removeNestedItemFromBlock(activeSection.id, item.id)
                      }}
                    >
                      Remove
                    </button>
                  </span>
                </div>
              ))}
            </div>

            {activeNestedItem ? (
              <div className="nested-item-editor">
                <h4>Editing {activeNestedItem.type === sectionTypes.TEXT ? 'Text Box' : 'Image'}</h4>

                {activeNestedItem.type === sectionTypes.TEXT ? (
                  <>
                    <label>
                      Text
                      <textarea
                        value={activeNestedItem.text || ''}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            text: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Width (%)
                      <input
                        type="number"
                        min="20"
                        max="100"
                        value={activeNestedItem.width || 100}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            width: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Level
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={activeNestedItem.level || 0}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            level: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Horizontal Offset
                      <input
                        type="number"
                        min="-1000"
                        max="1000"
                        value={activeNestedItem.offsetX || 0}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            offsetX: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Alignment
                      <select
                        value={activeNestedItem.align || 'left'}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            align: event.target.value,
                          })
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Image URL
                      <input
                        value={activeNestedItem.src || ''}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            src: event.target.value,
                          })
                        }
                        placeholder="Drop or type an image URL"
                      />
                    </label>
                    <label>
                      Alt Text
                      <input
                        value={activeNestedItem.alt || ''}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            alt: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Caption
                      <input
                        value={activeNestedItem.caption || ''}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            caption: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Width (%)
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={activeNestedItem.width || 100}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            width: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Level
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={activeNestedItem.level || 0}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            level: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Height (px)
                      <input
                        type="number"
                        min="60"
                        max="900"
                        value={activeNestedItem.height || 220}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            height: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label>
                      Position
                      <select
                        value={activeNestedItem.position || 'center'}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            position: event.target.value,
                          })
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </label>
                    <label>
                      Choose Image File
                      <input
                        ref={nestedImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageFile(
                            activeSection.id,
                            event.target.files?.[0],
                            true,
                            activeNestedItem.id,
                          )
                        }
                      />
                    </label>
                    <label>
                      Horizontal Offset
                      <input
                        type="number"
                        min="-300"
                        max="300"
                        value={activeNestedItem.offsetX || 0}
                        onChange={(event) =>
                          patchNestedItem(activeSection.id, activeNestedItem.id, {
                            offsetX: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        patchNestedItem(activeSection.id, activeNestedItem.id, {
                          src: '',
                          alt: '',
                          caption: '',
                        })
                      }
                    >
                      Clear Image
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="nested-item-empty">Add a text box or image to start building inside this block.</p>
            )}
          </div>
        </>
      )}

      {activeFloatingButton && (
        <>
          <label>
            Label
            <input
              value={activeFloatingButton.label}
              onChange={(event) =>
                patchFloatingButton(activeFloatingButton.id, { label: event.target.value })
              }
            />
          </label>
          <label>
            Link
            <input
              value={activeFloatingButton.href}
              onChange={(event) =>
                patchFloatingButton(activeFloatingButton.id, { href: event.target.value })
              }
            />
          </label>
          <label>
            Offset X
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingButton.offsetX || 0}
              onChange={(event) =>
                patchFloatingButton(activeFloatingButton.id, { offsetX: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Offset Y
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingButton.offsetY || 0}
              onChange={(event) =>
                patchFloatingButton(activeFloatingButton.id, { offsetY: Number(event.target.value) })
              }
            />
          </label>
          <button
            type="button"
            onClick={() => patchFloatingButton(activeFloatingButton.id, { offsetX: 0, offsetY: 0 })}
          >
            Reset Position
          </button>
          <button
            type="button"
            className="remove-btn"
            onClick={() => {
              setFloatingButtons((current) => current.filter((button) => button.id !== activeFloatingButton.id))
              setActiveFloatingButtonId(null)
            }}
          >
            Remove Floating Button
          </button>
        </>
      )}

      {activeFloatingText && (
        <>
          <label>
            Text
            <textarea
              value={activeFloatingText.text}
              onChange={(event) =>
                patchFloatingText(activeFloatingText.id, { text: event.target.value })
              }
            />
          </label>
          <label>
            Width (px)
            <input
              type="number"
              min="140"
              max="900"
              value={activeFloatingText.width || 280}
              onChange={(event) =>
                patchFloatingText(activeFloatingText.id, { width: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Alignment
            <select
              value={activeFloatingText.align || 'left'}
              onChange={(event) =>
                patchFloatingText(activeFloatingText.id, { align: event.target.value })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label>
            Offset X
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingText.offsetX || 0}
              onChange={(event) =>
                patchFloatingText(activeFloatingText.id, { offsetX: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Offset Y
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingText.offsetY || 0}
              onChange={(event) =>
                patchFloatingText(activeFloatingText.id, { offsetY: Number(event.target.value) })
              }
            />
          </label>
          <button
            type="button"
            onClick={() => patchFloatingText(activeFloatingText.id, { offsetX: 0, offsetY: 0 })}
          >
            Reset Position
          </button>
          <button
            type="button"
            className="remove-btn"
            onClick={() => {
              setFloatingTexts((current) => current.filter((textBox) => textBox.id !== activeFloatingText.id))
              setActiveFloatingTextId(null)
            }}
          >
            Remove Floating Text
          </button>
        </>
      )}

      {activeFloatingImage && (
        <>
          <label>
            Image URL
            <input
              value={activeFloatingImage.src}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { src: event.target.value })
              }
            />
          </label>
          <label>
            Alt Text
            <input
              value={activeFloatingImage.alt}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { alt: event.target.value })
              }
            />
          </label>
          <label>
            Caption
            <textarea
              value={activeFloatingImage.caption}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { caption: event.target.value })
              }
            />
          </label>
          <label>
            Width (px)
            <input
              type="number"
              min="120"
              max="1200"
              value={activeFloatingImage.width || 320}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { width: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Height (px)
            <input
              type="number"
              min="80"
              max="900"
              value={activeFloatingImage.height || 220}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { height: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Replace Image File
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleFloatingImageFile(activeFloatingImage.id, event.target.files?.[0])}
            />
          </label>
          <label>
            Offset X
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingImage.offsetX || 0}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { offsetX: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Offset Y
            <input
              type="number"
              min="-1000"
              max="1000"
              value={activeFloatingImage.offsetY || 0}
              onChange={(event) =>
                patchFloatingImage(activeFloatingImage.id, { offsetY: Number(event.target.value) })
              }
            />
          </label>
          <button
            type="button"
            onClick={() => patchFloatingImage(activeFloatingImage.id, { offsetX: 0, offsetY: 0 })}
          >
            Reset Position
          </button>
          <button
            type="button"
            className="remove-btn"
            onClick={() => {
              setFloatingImages((current) => current.filter((imageBox) => imageBox.id !== activeFloatingImage.id))
              setActiveFloatingImageId(null)
            }}
          >
            Remove Floating Image
          </button>
        </>
      )}

      {!activeFloatingButton && activeSection && activeSection.type === sectionTypes.BUTTON && (
        <p className="nested-item-empty">Legacy button sections are no longer created from the palette.</p>
      )}

      {!activeFloatingText && activeSection && activeSection.type === sectionTypes.TEXT && (
        <p className="nested-item-empty">Legacy text sections are no longer created from the palette.</p>
      )}

      {!activeFloatingImage && activeSection && activeSection.type === sectionTypes.IMAGE && (
        <p className="nested-item-empty">Legacy image sections are no longer created from the palette.</p>
      )}

      <NavigationSectionEditor
        activeSection={activeSection}
        activeNavigationLinks={activeNavigationLinks}
        patchSection={patchSection}
        addNavigationLink={addNavigationLink}
        updateNavigationLink={updateNavigationLink}
        removeNavigationLink={removeNavigationLink}
        handleNavigationLogoFile={handleNavigationLogoFile}
      />

      {activeSection && activeSection.type === sectionTypes.FOOTER && (
        <label>
          Footer text
          <textarea
            value={activeSection.text}
            onChange={(event) =>
              patchSection(activeSection.id, { text: event.target.value })
            }
          />
        </label>
      )}

      {activeSection && (
        <button
          type="button"
          className="remove-btn"
          onClick={() => removeSection(activeSection.id)}
        >
          Remove Selected
        </button>
      )}
    </div>
  )
}
