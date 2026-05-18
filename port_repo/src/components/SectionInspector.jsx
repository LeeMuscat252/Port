import React, { useMemo, useState } from 'react'
import NavigationSectionEditor from './NavigationSectionEditor'

function buildGradientString(type, angle, stops = []) {
  if (!type || type === 'none' || !stops || stops.length === 0) return ''

  const stopStrings = stops
    .map((stop) => {
      const color = (stop.color || '#000000').replaceAll('\n', '')
      const position = stop.position != null ? `${stop.position}%` : ''
      return `${color} ${position}`.trim()
    })
    .join(', ')

  return type === 'linear' ? `linear-gradient(${angle || '135deg'}, ${stopStrings})` : ''
}

function GradientAngleInput({ gradientAngle, onAngleChange }) {
  const [angleInput, setAngleInput] = useState(() => {
    const value = parseInt(gradientAngle, 10)
    return Number.isNaN(value) ? '' : String(value)
  })

  const commit = (value) => {
    const nextValue = value === '' ? 0 : Number(value)
    if (Number.isNaN(nextValue)) return

    const clamped = Math.max(0, Math.min(360, Math.round(nextValue)))
    setAngleInput(String(clamped))
    onAngleChange(`${clamped}deg`)
  }

  return (
    <input
      type="number"
      min="0"
      max="360"
      value={angleInput}
      onChange={(event) => setAngleInput(event.target.value)}
      onBlur={(event) => commit(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit(event.currentTarget.value)
      }}
      style={{ width: 80 }}
    />
  )
}

function GradientEditor({ item, onPatch }) {
  const initial = item.style || {}
  const [gradientType, setGradientType] = useState(initial.gradientType || 'none')
  const [gradientAngle, setGradientAngle] = useState(initial.gradientAngle || '135deg')
  const [stops, setStops] = useState(() => {
    const initialStops = initial.gradientStops || []
    if (initialStops.length >= 2) return [initialStops[0], initialStops[1]]
    return [{ position: 0, color: '#ffffff' }, { position: 100, color: '#000000' }]
  })

  const apply = (next) => {
    const nextStops = next.stops ?? stops
    const nextType = next.type ?? gradientType
    const nextAngle = next.angle ?? gradientAngle
    const backgroundImage = buildGradientString(nextType, nextAngle, nextStops)
    const style = { ...(item.style || {}) }
    delete style.background
    onPatch({
      style: {
        ...style,
        gradientType: nextType,
        gradientStops: nextStops,
        gradientAngle: nextAngle,
        backgroundImage,
      },
    })
  }

  const updateStop = (index, patch) => {
    const nextStops = stops.map((stop, stopIndex) => (stopIndex === index ? { ...stop, ...patch } : stop))
    setStops(nextStops)
    apply({ stops: nextStops })
  }

  const removeGradient = () => {
    const style = { ...(item.style || {}) }
    delete style.gradientType
    delete style.gradientStops
    delete style.gradientAngle
    delete style.backgroundImage
    onPatch({ style })
    setGradientType('none')
    setGradientAngle('135deg')
    setStops([{ position: 0, color: '#ffffff' }, { position: 100, color: '#000000' }])
  }

  return (
    <div style={{ marginTop: 8, borderTop: '1px solid #eee', paddingTop: 8 }}>
      <h5 style={{ margin: '6px 0' }}>Gradient background</h5>
      <label>
        Gradient type
        <select
          value={gradientType}
          onChange={(event) => {
            setGradientType(event.target.value)
            apply({ type: event.target.value })
          }}
        >
          <option value="none">None</option>
          <option value="linear">Linear</option>
        </select>
      </label>

      {gradientType !== 'none' && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              Angle
              <GradientAngleInput
                gradientAngle={gradientAngle}
                onAngleChange={(nextAngle) => {
                  setGradientAngle(nextAngle)
                  apply({ angle: nextAngle })
                }}
              />
              <span style={{ minWidth: 60 }}>{gradientAngle}</span>
            </label>
            <button type="button" onClick={removeGradient}>Remove gradient</button>
          </div>

          <div style={{ marginTop: 8 }}>
            {stops.map((stop, index) => (
              <div key={index} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input
                  type="color"
                  value={stop.color || (index === 0 ? '#ffffff' : '#000000')}
                  onChange={(event) => updateStop(index, { color: event.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stop.position != null ? stop.position : index === 0 ? 0 : 100}
                  onChange={(event) => updateStop(index, { position: Number(event.target.value) || 0 })}
                />
                <div style={{ color: '#666', fontSize: 12 }}>{index === 0 ? 'start' : 'end'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SectionInspector({
  sectionTypes,
  activeSection,
  activeFloatingButton,
  activeFloatingText,
  activeFloatingImage,
  activeFloatingCarousel,
  activeFloatingCarouselImageId,
  activeNestedItem,
  activeNestedItemId,
  imageInputRef,
  patchSection,
  addNestedItemToBlock,
  updateNestedItemSelection,
  moveNestedItemInBlock,
  removeNestedItemFromBlock,
  patchNestedItem,
  nestedImageInputRef,
  handleImageFile,
  handleFloatingImageFile,
  activeCarouselImage,
  setActiveCarouselImageId,
  patchCarouselImage,
  addCarouselImage,
  removeCarouselImage,
  moveCarouselImage,
  handleCarouselImageFile,
  patchFloatingButton,
  setFloatingButtons,
  setActiveFloatingButtonId,
  patchFloatingText,
  setFloatingTexts,
  setActiveFloatingTextId,
  patchFloatingImage,
  setFloatingImages,
  setActiveFloatingImageId,
  patchFloatingCarousel,
  setFloatingCarousels,
  setActiveFloatingCarouselId,
  addFloatingCarouselImage,
  removeFloatingCarouselImage,
  moveFloatingCarouselImage,
  patchFloatingCarouselImage,
  handleFloatingCarouselImageFile,
  setActiveFloatingCarouselImageId,
  activeNavigationLinks,
  addNavigationLink,
  updateNavigationLink,
  removeNavigationLink,
  handleNavigationLogoFile,
  removeSection,
}) {
  const floatingCarouselImage = useMemo(() => {
    const images = activeFloatingCarousel?.images || []
    return images.find((image) => image.id === activeFloatingCarouselImageId) ?? images[0] ?? null
  }, [activeFloatingCarousel, activeFloatingCarouselImageId])

  const inspectorTarget = activeSection
    ? { item: activeSection, kind: 'section', title: activeSection.type }
    : activeFloatingButton
      ? { item: activeFloatingButton, kind: 'floatingButton', title: 'button' }
      : activeFloatingText
        ? { item: activeFloatingText, kind: 'floatingText', title: 'text' }
        : activeFloatingImage
          ? { item: activeFloatingImage, kind: 'floatingImage', title: 'image' }
          : activeFloatingCarousel
            ? { item: activeFloatingCarousel, kind: 'floatingCarousel', title: 'image carousel' }
            : null

  if (!inspectorTarget) {
    return (
      <div style={{ padding: 12, fontSize: 13, color: '#666' }}>
        No component selected.
      </div>
    )
  }

  const { item, kind, title } = inspectorTarget
  const isSection = kind === 'section'
  const isText = item.type === sectionTypes.TEXT
  const isImage = item.type === sectionTypes.IMAGE
  const isButton = item.type === sectionTypes.BUTTON
  const isCarousel = item.type === sectionTypes.CAROUSEL

  const onPatch = (patch) => {
    if (kind === 'section') patchSection?.(item.id, patch)
    if (kind === 'floatingButton') patchFloatingButton?.(item.id, patch)
    if (kind === 'floatingText') patchFloatingText?.(item.id, patch)
    if (kind === 'floatingImage') patchFloatingImage?.(item.id, patch)
    if (kind === 'floatingCarousel') patchFloatingCarousel?.(item.id, patch)
  }

  const patchStyle = (patch) => {
    onPatch({ style: { ...(item.style || {}), ...patch } })
  }

  const removeSelected = () => {
    if (kind === 'section') {
      removeSection?.(item.id)
      return
    }

    if (kind === 'floatingButton') {
      setFloatingButtons?.((current) => current.filter((button) => button.id !== item.id))
      setActiveFloatingButtonId?.(null)
    }
    if (kind === 'floatingText') {
      setFloatingTexts?.((current) => current.filter((textBox) => textBox.id !== item.id))
      setActiveFloatingTextId?.(null)
    }
    if (kind === 'floatingImage') {
      setFloatingImages?.((current) => current.filter((imageBox) => imageBox.id !== item.id))
      setActiveFloatingImageId?.(null)
    }
    if (kind === 'floatingCarousel') {
      setFloatingCarousels?.((current) => current.filter((carousel) => carousel.id !== item.id))
      setActiveFloatingCarouselId?.(null)
      setActiveFloatingCarouselImageId?.(null)
    }
  }

  const currentCarouselImage = kind === 'floatingCarousel' ? floatingCarouselImage : activeCarouselImage

  return (
    <div className="section-inspector" style={{ padding: 12 }}>
      <h4 style={{ marginTop: 0 }}>Editing {title}</h4>

      {isSection && item.type === sectionTypes.BLOCK && (
        <div>
          <label>
            Block Title
            <input value={item.title || ''} onChange={(event) => onPatch({ title: event.target.value })} />
          </label>

          <label>
            Block Body
            <textarea value={item.body || ''} onChange={(event) => onPatch({ body: event.target.value })} />
          </label>

          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button type="button" onClick={() => addNestedItemToBlock(item.id, sectionTypes.TEXT)}>Add Text Box</button>
              <button type="button" onClick={() => addNestedItemToBlock(item.id, sectionTypes.IMAGE)}>Add Image</button>
            </div>

            <div className="nested-item-list">
              {(item.nestedItems || []).map((nestedItem, index) => (
                <div
                  key={nestedItem.id}
                  className={`nested-item-row ${activeNestedItemId === nestedItem.id ? 'active' : ''}`}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: 6, border: '1px solid #eee', marginBottom: 6 }}
                  onClick={() => updateNestedItemSelection(item.id, nestedItem.id)}
                >
                  <div>{index + 1}. {nestedItem.type}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button type="button" onClick={(event) => { event.stopPropagation(); moveNestedItemInBlock(item.id, nestedItem.id, -1) }} disabled={index === 0}>Up</button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); moveNestedItemInBlock(item.id, nestedItem.id, 1) }} disabled={index === (item.nestedItems || []).length - 1}>Down</button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); removeNestedItemFromBlock(item.id, nestedItem.id) }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {activeNestedItem ? (
              <div className="nested-item-editor" style={{ marginTop: 8, padding: 8, border: '1px solid #ddd' }}>
                <h5>Editing {activeNestedItem.type}</h5>
                {activeNestedItem.type === sectionTypes.TEXT ? (
                  <div>
                    <label>Text</label>
                    <textarea value={activeNestedItem.text || ''} onChange={(event) => patchNestedItem(item.id, activeNestedItem.id, { text: event.target.value })} />
                  </div>
                ) : (
                  <div>
                    <label>Image URL</label>
                    <input value={activeNestedItem.src || ''} onChange={(event) => patchNestedItem(item.id, activeNestedItem.id, { src: event.target.value })} />
                    <label>Alt text</label>
                    <input value={activeNestedItem.alt || ''} onChange={(event) => patchNestedItem(item.id, activeNestedItem.id, { alt: event.target.value })} />
                    <label>Caption</label>
                    <input value={activeNestedItem.caption || ''} onChange={(event) => patchNestedItem(item.id, activeNestedItem.id, { caption: event.target.value })} />
                    <label style={{ display: 'block', marginTop: 6 }}>Replace Image File</label>
                    <input ref={nestedImageInputRef} type="file" accept="image/*" onChange={(event) => handleImageFile(item.id, event.target.files?.[0], true, activeNestedItem.id)} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {isText && (
        <div style={{ marginBottom: 8 }}>
          <label>Text</label>
          <textarea value={item.text || ''} onChange={(event) => onPatch({ text: event.target.value })} />
          <label>Align</label>
          <select value={item.align || 'left'} onChange={(event) => onPatch({ align: event.target.value })}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      )}

      {isImage && (
        <div style={{ marginBottom: 8 }}>
          <label>Image URL</label>
          <input value={item.src || ''} onChange={(event) => onPatch({ src: event.target.value })} />
          <label>Alt text</label>
          <input value={item.alt || ''} onChange={(event) => onPatch({ alt: event.target.value })} />
          <label>Caption</label>
          <input value={item.caption || ''} onChange={(event) => onPatch({ caption: event.target.value })} />
          <label>Width</label>
          <input type="number" min="10" value={item.width || ''} onChange={(event) => onPatch({ width: Number(event.target.value) || undefined })} />
          <label>Height</label>
          <input type="number" min="40" value={item.height || ''} onChange={(event) => onPatch({ height: Number(event.target.value) || undefined })} />
          <label style={{ display: 'block', marginTop: 6 }}>Replace Image File</label>
          <input
            ref={isSection ? imageInputRef : undefined}
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (kind === 'floatingImage') handleFloatingImageFile?.(item.id, event.target.files?.[0])
              else handleImageFile?.(item.id, event.target.files?.[0])
            }}
          />
        </div>
      )}

      {isCarousel && (
        <div className="carousel-editor-panel" style={{ marginBottom: 8 }}>
          <label>Height</label>
          <input type="number" min="120" value={item.height || ''} onChange={(event) => onPatch({ height: Number(event.target.value) || undefined })} />
          <label>Slide image width (%)</label>
          <input type="number" min="10" max="100" value={item.imageWidth || 100} onChange={(event) => onPatch({ imageWidth: Number(event.target.value) || 100 })} />
          <label>Slide image height (px)</label>
          <input
            type="number"
            min="80"
            placeholder="Fill carousel"
            value={item.imageHeight || ''}
            onChange={(event) => onPatch({ imageHeight: Number(event.target.value) || null })}
          />
          {kind === 'floatingCarousel' ? (
            <>
              <label>Width</label>
              <input type="number" min="120" value={item.width || ''} onChange={(event) => onPatch({ width: Number(event.target.value) || undefined })} />
            </>
          ) : null}
          <label>
            <input type="checkbox" checked={item.autoplay !== false} onChange={(event) => onPatch({ autoplay: event.target.checked })} />
            Autoplay
          </label>
          <label>
            <input type="checkbox" checked={item.showCaptions !== false} onChange={(event) => onPatch({ showCaptions: event.target.checked })} />
            Show captions
          </label>

          <div className="button-row compact">
            <button
              type="button"
              onClick={() => {
                if (kind === 'floatingCarousel') addFloatingCarouselImage?.(item.id)
                else addCarouselImage?.(item.id)
              }}
            >
              Add slide
            </button>
          </div>

          <div className="carousel-image-list">
            {(item.images || []).map((image, index) => (
              <div
                key={image.id}
                className={`carousel-image-row ${currentCarouselImage?.id === image.id ? 'active' : ''}`}
                onClick={() => {
                  if (kind === 'floatingCarousel') setActiveFloatingCarouselImageId?.(image.id)
                  else setActiveCarouselImageId?.(image.id)
                }}
              >
                <div className="carousel-image-row-label">{index + 1}. {image.caption || image.alt || 'Slide'}</div>
                <div className="carousel-image-row-actions">
                  <button
                    type="button"
                    className="carousel-image-action"
                    onClick={(event) => {
                      event.stopPropagation()
                      if (kind === 'floatingCarousel') moveFloatingCarouselImage?.(item.id, image.id, -1)
                      else moveCarouselImage?.(item.id, image.id, -1)
                    }}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="carousel-image-action"
                    onClick={(event) => {
                      event.stopPropagation()
                      if (kind === 'floatingCarousel') moveFloatingCarouselImage?.(item.id, image.id, 1)
                      else moveCarouselImage?.(item.id, image.id, 1)
                    }}
                    disabled={index === (item.images || []).length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="carousel-image-action"
                    onClick={(event) => {
                      event.stopPropagation()
                      if (kind === 'floatingCarousel') removeFloatingCarouselImage?.(item.id, image.id)
                      else removeCarouselImage?.(item.id, image.id)
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {currentCarouselImage ? (
            <div className="nested-item-editor" style={{ marginTop: 8, padding: 8, border: '1px solid #ddd' }}>
              <h5>Editing slide</h5>
              <label>Slide Image URL</label>
              <input
                value={currentCarouselImage.src || ''}
                onChange={(event) => {
                  if (kind === 'floatingCarousel') patchFloatingCarouselImage?.(item.id, currentCarouselImage.id, { src: event.target.value })
                  else patchCarouselImage?.(item.id, currentCarouselImage.id, { src: event.target.value })
                }}
              />
              <label>Alt text</label>
              <input
                value={currentCarouselImage.alt || ''}
                onChange={(event) => {
                  if (kind === 'floatingCarousel') patchFloatingCarouselImage?.(item.id, currentCarouselImage.id, { alt: event.target.value })
                  else patchCarouselImage?.(item.id, currentCarouselImage.id, { alt: event.target.value })
                }}
              />
              <label>Caption</label>
              <input
                value={currentCarouselImage.caption || ''}
                onChange={(event) => {
                  if (kind === 'floatingCarousel') patchFloatingCarouselImage?.(item.id, currentCarouselImage.id, { caption: event.target.value })
                  else patchCarouselImage?.(item.id, currentCarouselImage.id, { caption: event.target.value })
                }}
              />
              <label style={{ display: 'block', marginTop: 6 }}>Replace Slide Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (kind === 'floatingCarousel') handleFloatingCarouselImageFile?.(item.id, currentCarouselImage.id, event.target.files?.[0])
                  else handleCarouselImageFile?.(item.id, currentCarouselImage.id, event.target.files?.[0])
                }}
              />
            </div>
          ) : null}
        </div>
      )}

      {isButton && (
        <div style={{ marginBottom: 8 }}>
          <label>Label</label>
          <input value={item.label || ''} onChange={(event) => onPatch({ label: event.target.value })} />
          <label>Href</label>
          <input value={item.href || ''} onChange={(event) => onPatch({ href: event.target.value })} />
        </div>
      )}

      <div className="section-style" style={{ marginTop: 8 }}>
        <label>
          Background
          <input type="color" value={(item.style && item.style.background) || '#ffffff'} onChange={(event) => patchStyle({ background: event.target.value })} />
        </label>
        <label>
          Text color
          <input type="color" value={(item.style && item.style.color) || '#111111'} onChange={(event) => patchStyle({ color: event.target.value })} />
        </label>
        <label>
          Padding
          <input placeholder="12px" value={(item.style && item.style.padding) || ''} onChange={(event) => patchStyle({ padding: event.target.value })} />
        </label>
        <label>
          Border radius
          <input placeholder="8px" value={(item.style && item.style.borderRadius) || ''} onChange={(event) => patchStyle({ borderRadius: event.target.value })} />
        </label>
        <GradientEditor key={item.id} item={item} onPatch={onPatch} />
      </div>

      {isSection ? (
        <NavigationSectionEditor
          activeSection={item}
          activeNavigationLinks={activeNavigationLinks}
          patchSection={patchSection}
          addNavigationLink={addNavigationLink}
          updateNavigationLink={updateNavigationLink}
          removeNavigationLink={removeNavigationLink}
          handleNavigationLogoFile={handleNavigationLogoFile}
        />
      ) : null}

      <div style={{ marginTop: 10 }}>
        <button type="button" className="remove-btn" onClick={removeSelected}>Remove Selected</button>
      </div>
    </div>
  )
}
