import NavigationPreview from './NavigationPreview'

export default function PreviewStage({
  isEditorCollapsed,
  setIsEditorCollapsed,
  onDragEnd,
  dropIndex,
  onDropZoneEnter,
  onDropZoneDrop,
  onSectionDragStart,
  sections,
  activeSectionId,
  setActiveSectionId,
  setActiveFloatingButtonId,
  setActiveFloatingTextId,
  setActiveFloatingImageId,
  resizingSectionId,
  startResize,
  sectionTypes,
  draggingImage,
  startImageDrag,
  resizingImage,
  startImageResize,
  onBlockImageDrop,
  setDropIndex,
  groupNestedItemsByLevel,
  activeNestedItemId,
  setActiveNestedItemId,
  startNestedItemDrag,
  getNestedImageWidth,
  getNestedTextWidth,
  draggingButton,
  startButtonDrag,
  floatingButtons,
  floatingTexts,
  floatingImages,
  draggingFloatingText,
  draggingFloatingImage,
  startFloatingTextDrag,
  startFloatingImageDrag,
  resizingFloatingImage,
  startFloatingImageResize,
}) {
  return (
    <section className="frame-stage" onDragEnd={onDragEnd}>
      <div className="preview-header">
        <h2>Live preview</h2>
        <button
          type="button"
          className="editor-toggle-btn"
          onClick={() => setIsEditorCollapsed((current) => !current)}
        >
          {isEditorCollapsed ? 'Show Editor' : 'Hide Editor'}
        </button>
      </div>
      <div className="preview-canvas">
        <div
          className={`preview-drop-zone ${dropIndex === 0 ? 'active' : ''}`}
          onDragOver={(event) => onDropZoneEnter(event, 0)}
          onDrop={(event) => onDropZoneDrop(event, 0)}
        >
          {sections.length === 0 ? 'Drop components here' : 'Drop here'}
        </div>

        {sections.map((section, index) => {
          const isActive = section.id === activeSectionId

          return (
            <div key={section.id}>
              <article
                className={`preview-section preview-block ${section.type} ${isActive ? 'active' : ''} ${resizingSectionId === section.id ? 'resizing' : ''}`}
                draggable
                onDragStart={(event) => onSectionDragStart(event, section.id)}
                onClick={() => {
                  setActiveSectionId(section.id)
                  setActiveFloatingButtonId(null)
                  setActiveFloatingTextId(null)
                  setActiveFloatingImageId(null)
                }}
                style={{
                  minHeight: section.height ? `${section.height}px` : undefined,
                  textAlign: section.align || 'left',
                }}
              >
                <div
                  className="resize-handle"
                  onPointerDown={(event) => startResize(event, section.id, section.height)}
                >
                  Drag to resize
                </div>
                {section.type === sectionTypes.HEADER && (
                  <>
                    <h3>{section.title}</h3>
                    <p>{section.subtitle}</p>
                  </>
                )}
                {section.type === sectionTypes.TEXT && <p>{section.text}</p>}
                {section.type === sectionTypes.IMAGE && (
                  <figure className={`image-figure position-${section.position || 'center'}`}>
                    <div
                      className={`image-frame ${
                        draggingImage?.sectionId === section.id && !draggingImage?.isNested
                          ? 'active'
                          : ''
                      }`}
                    >
                      <img
                        src={section.src}
                        alt={section.alt}
                        draggable={false}
                        onDragStart={(event) => event.preventDefault()}
                        onPointerDown={(event) =>
                          startImageDrag(event, section.id, section.offsetX || 0, false)
                        }
                        style={{
                          width: section.width ? `${section.width}%` : undefined,
                          height: section.height ? `${section.height}px` : undefined,
                          objectFit: 'cover',
                          transform: `translateX(${section.offsetX || 0}px)`,
                          cursor: 'grab',
                        }}
                      />
                      <div
                        className={`image-resize-frame ${
                          resizingImage?.sectionId === section.id && !resizingImage?.isNested
                            ? 'active'
                            : ''
                        }`}
                      >
                        <span
                          className="image-resize-handle left"
                          onPointerDown={(event) =>
                            startImageResize(event, section.id, section.width || 100, 'left', false)
                          }
                        />
                        <span
                          className="image-resize-handle right"
                          onPointerDown={(event) =>
                            startImageResize(event, section.id, section.width || 100, 'right', false)
                          }
                        />
                      </div>
                    </div>
                    <figcaption>{section.caption}</figcaption>
                  </figure>
                )}
                {section.type === sectionTypes.BLOCK && (
                  <div
                    className="nested-items-canvas"
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDropIndex(index + 1)
                    }}
                    onDrop={(event) => onBlockImageDrop(event, section.id)}
                  >
                    <h4>{section.title}</h4>
                    <p>{section.body}</p>
                    <div className="nested-item-preview-list">
                      {groupNestedItemsByLevel(section.nestedItems || []).map((levelItems, levelIndex) => (
                        <div key={`level-${levelIndex}`} className="nested-level-row">
                          {levelItems.map((item) => (
                            <div
                              key={item.id}
                              className={`nested-item-preview ${item.type} ${
                                activeSectionId === section.id && activeNestedItemId === item.id ? 'active' : ''
                              }`}
                              style={
                                item.type === sectionTypes.IMAGE || item.type === sectionTypes.TEXT
                                  ? {
                                      position: 'relative',
                                      width:
                                        item.type === sectionTypes.IMAGE
                                          ? `${getNestedImageWidth(item.width)}px`
                                          : `${getNestedTextWidth(item.width)}px`,
                                      left: `${item.offsetX || 0}px`,
                                    }
                                  : undefined
                              }
                              onClick={(event) => {
                                event.stopPropagation()
                                setActiveSectionId(section.id)
                                setActiveNestedItemId(item.id)
                              }}
                            >
                              {item.type === sectionTypes.TEXT ? (
                                <p
                                  style={{
                                    textAlign: item.align || 'left',
                                    width: '100%',
                                    cursor: 'grab',
                                    touchAction: 'none',
                                  }}
                                  onPointerDown={(event) =>
                                    startNestedItemDrag(event, section.id, item.offsetX || 0, item.id)
                                  }
                                >
                                  {item.text}
                                </p>
                              ) : (
                                <figure className={`nested-image position-${item.position || 'center'}`}>
                                  <div
                                    className={`image-frame nested ${
                                      draggingImage?.sectionId === section.id && draggingImage?.nestedItemId === item.id
                                        ? 'active'
                                        : ''
                                    }`}
                                  >
                                    <img
                                      src={item.src}
                                      alt={item.alt}
                                      draggable={false}
                                      onDragStart={(event) => event.preventDefault()}
                                      onPointerDown={(event) =>
                                        startImageDrag(event, section.id, item.offsetX || 0, true, item.id)
                                      }
                                      style={{
                                        width: '100%',
                                        height: item.height ? `${item.height}px` : undefined,
                                        objectFit: 'cover',
                                        cursor: 'grab',
                                        touchAction: 'none',
                                      }}
                                    />
                                    <div
                                      className={`image-resize-frame nested ${
                                        resizingImage?.sectionId === section.id && resizingImage?.nestedItemId === item.id
                                          ? 'active'
                                          : ''
                                      }`}
                                    >
                                      <span
                                        className="image-resize-handle left"
                                        onPointerDown={(event) =>
                                          startImageResize(
                                            event,
                                            section.id,
                                            item.width || 100,
                                            'left',
                                            true,
                                            item.id,
                                          )
                                        }
                                      />
                                      <span
                                        className="image-resize-handle right"
                                        onPointerDown={(event) =>
                                          startImageResize(
                                            event,
                                            section.id,
                                            item.width || 100,
                                            'right',
                                            true,
                                            item.id,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <figcaption>{item.caption}</figcaption>
                                </figure>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {section.type === sectionTypes.BUTTON && (
                  <div
                    className={`button-positioner ${
                      draggingButton?.sectionId === section.id ? 'active' : ''
                    }`}
                    style={{
                      position: 'relative',
                      left: `${section.offsetX || 0}px`,
                      top: `${section.offsetY || 0}px`,
                      display: 'inline-block',
                    }}
                    onPointerDown={(event) =>
                      startButtonDrag(event, section.id, section.offsetX || 0, section.offsetY || 0)
                    }
                  >
                    <a className="preview-button" href={section.href}>
                      {section.label}
                    </a>
                  </div>
                )}
                {section.type === sectionTypes.NAVIGATION && <NavigationPreview section={section} />}
                {section.type === sectionTypes.FOOTER && <footer>{section.text}</footer>}
              </article>

              <div
                className={`preview-drop-zone ${dropIndex === index + 1 ? 'active' : ''}`}
                onDragOver={(event) => onDropZoneEnter(event, index + 1)}
                onDrop={(event) => onDropZoneDrop(event, index + 1)}
              >
                Drop here
              </div>
            </div>
          )
        })}
        <div className="floating-button-layer">
          {floatingButtons.map((button) => (
            <div
              key={button.id}
              className={`button-positioner floating ${draggingButton?.sectionId === button.id ? 'active' : ''}`}
              style={{
                position: 'absolute',
                left: `${button.offsetX || 0}px`,
                top: `${button.offsetY || 0}px`,
              }}
              onClick={(event) => {
                event.stopPropagation()
                setActiveSectionId(null)
                setActiveFloatingButtonId(button.id)
                setActiveFloatingTextId(null)
                setActiveFloatingImageId(null)
              }}
              onPointerDown={(event) =>
                startButtonDrag(event, button.id, button.offsetX || 0, button.offsetY || 0)
              }
            >
              <a className="preview-button" href={button.href}>
                {button.label}
              </a>
            </div>
          ))}
          {floatingTexts.map((textBox) => (
            <div
              key={textBox.id}
              className={`floating-text-box ${draggingFloatingText?.textId === textBox.id ? 'active' : ''}`}
              style={{
                left: `${textBox.offsetX || 0}px`,
                top: `${textBox.offsetY || 0}px`,
                width: `${textBox.width || 280}px`,
                textAlign: textBox.align || 'left',
              }}
              onClick={(event) => {
                event.stopPropagation()
                setActiveSectionId(null)
                setActiveFloatingButtonId(null)
                setActiveFloatingTextId(textBox.id)
                setActiveFloatingImageId(null)
              }}
              onPointerDown={(event) =>
                startFloatingTextDrag(event, textBox.id, textBox.offsetX || 0, textBox.offsetY || 0)
              }
            >
              <p>{textBox.text}</p>
            </div>
          ))}
          {floatingImages.map((imageBox) => (
            <figure
              key={imageBox.id}
              className={`floating-image-box ${draggingFloatingImage?.imageId === imageBox.id ? 'active' : ''}`}
              style={{
                left: `${imageBox.offsetX || 0}px`,
                top: `${imageBox.offsetY || 0}px`,
                width: `${imageBox.width || 320}px`,
              }}
              onClick={(event) => {
                event.stopPropagation()
                setActiveSectionId(null)
                setActiveFloatingButtonId(null)
                setActiveFloatingTextId(null)
                setActiveFloatingImageId(imageBox.id)
              }}
              onPointerDown={(event) =>
                startFloatingImageDrag(event, imageBox.id, imageBox.offsetX || 0, imageBox.offsetY || 0)
              }
            >
              <div className="floating-image-frame">
                <img
                  src={imageBox.src}
                  alt={imageBox.alt}
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  style={{
                    width: '100%',
                    height: imageBox.height ? `${imageBox.height}px` : undefined,
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <div
                  className={`floating-image-resize-frame ${
                    resizingFloatingImage?.imageId === imageBox.id ? 'active' : ''
                  }`}
                >
                  <span
                    className="image-resize-handle left"
                    onPointerDown={(event) =>
                      startFloatingImageResize(
                        event,
                        imageBox.id,
                        imageBox.width || 320,
                        imageBox.height || 220,
                        'left',
                        imageBox.offsetX || 0,
                        imageBox.offsetY || 0,
                      )
                    }
                  />
                  <span
                    className="image-resize-handle right"
                    onPointerDown={(event) =>
                      startFloatingImageResize(
                        event,
                        imageBox.id,
                        imageBox.width || 320,
                        imageBox.height || 220,
                        'right',
                        imageBox.offsetX || 0,
                        imageBox.offsetY || 0,
                      )
                    }
                  />
                  <span
                    className="image-resize-handle top"
                    onPointerDown={(event) =>
                      startFloatingImageResize(
                        event,
                        imageBox.id,
                        imageBox.width || 320,
                        imageBox.height || 220,
                        'top',
                        imageBox.offsetX || 0,
                        imageBox.offsetY || 0,
                      )
                    }
                  />
                  <span
                    className="image-resize-handle bottom"
                    onPointerDown={(event) =>
                      startFloatingImageResize(
                        event,
                        imageBox.id,
                        imageBox.width || 320,
                        imageBox.height || 220,
                        'bottom',
                        imageBox.offsetX || 0,
                        imageBox.offsetY || 0,
                      )
                    }
                  />
                </div>
              </div>
              <figcaption>{imageBox.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
