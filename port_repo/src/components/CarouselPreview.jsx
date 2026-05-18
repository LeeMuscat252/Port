import { useEffect, useState } from 'react'

export default function CarouselPreview({ section, onSelect }) {
  const images = Array.isArray(section.images) ? section.images.filter(Boolean) : []
  const [carouselState, setCarouselState] = useState({ sectionId: section.id, activeIndex: 0 })
  const activeIndex =
    carouselState.sectionId === section.id && carouselState.activeIndex < images.length
      ? carouselState.activeIndex
      : 0

  useEffect(() => {
    if (!section.autoplay || images.length < 2) {
      return undefined
    }

    const delay = Math.max(1000, Number(section.interval) || 4000)
    const timer = window.setInterval(() => {
      setCarouselState((current) => {
        const currentIndex = current.sectionId === section.id ? current.activeIndex : 0
        return {
          sectionId: section.id,
          activeIndex: (currentIndex + 1) % images.length,
        }
      })
    }, delay)

    return () => window.clearInterval(timer)
  }, [images.length, section.autoplay, section.id, section.interval])

  if (images.length === 0) {
    return <div className="carousel-empty-state">No images configured for this carousel.</div>
  }

  const showCaptions = section.showCaptions !== false
  const carouselStyle = {
    height: `${section.height || 320}px`,
    '--carousel-image-width': `${Number(section.imageWidth) || 100}%`,
    '--carousel-image-height': section.imageHeight ? `${Number(section.imageHeight)}px` : '100%',
  }

  const goToSlide = (delta) => {
    setCarouselState({
      sectionId: section.id,
      activeIndex: (activeIndex + delta + images.length) % images.length,
    })
  }

    return (
    <div className={`carousel-preview align-${section.align || 'center'}`} style={carouselStyle}>
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {images.map((image, index) => (
            <figure key={image.id} className="carousel-slide">
              <img
                src={image.src}
                alt={image.alt || 'Carousel slide'}
                draggable={false}
                style={{
                  ...(image.style || {}),
                  width: 'var(--carousel-image-width, 100%)',
                  height: 'var(--carousel-image-height, 100%)',
                  objectFit: 'cover',
                }}
                onClick={() => onSelect?.(index)}
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="carousel-footer">
        {showCaptions ? (
          <div className="carousel-caption" onClick={() => onSelect?.(activeIndex)}>{images[activeIndex]?.caption}</div>
        ) : null}
        <div className="carousel-controls">
          <button
            type="button"
            className="carousel-control-btn"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              onSelect?.(activeIndex)
              event.stopPropagation()
              goToSlide(-1)
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="carousel-control-btn"
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={(event) => {
              onSelect?.(activeIndex)
              event.stopPropagation()
              goToSlide(1)
            }}
          >
            Next
          </button>
        </div>

        <div className="carousel-indicators" aria-label="Carousel slides">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={(event) => {
                onSelect?.(index)
                event.stopPropagation()
                setCarouselState({ sectionId: section.id, activeIndex: index })
              }}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
