import { SECTION_TYPES } from '../constants/sections'
import { normalizeNavigationHrefForExport, normalizeNavigationLinks } from '../navigationUtils'
import { getNestedImageWidth, getNestedTextWidth } from './layoutFactories'

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const imagePositionToJustify = (position) => {
  if (position === 'left') return 'flex-start'
  if (position === 'right') return 'flex-end'
  return 'center'
}

export const buildHtmlDocument = (sections, pageTitle, floatingButtons = [], floatingTexts = [], floatingImages = []) => {
  const sectionMarkup = sections
    .map((section) => {
      const sectionStyle = [
        section.align ? `text-align:${section.align};` : '',
        section.height ? `min-height:${section.height}px;` : '',
      ]
        .filter(Boolean)
        .join(' ')
      const sectionStyleAttr = sectionStyle ? ` style="${sectionStyle}"` : ''

      if (section.type === SECTION_TYPES.HEADER) {
        return `\n  <section class="section section-header"${sectionStyleAttr}>\n    <h3>${escapeHtml(section.title || '')}</h3>\n    <p>${escapeHtml(section.subtitle || '')}</p>\n  </section>`
      }

      if (section.type === SECTION_TYPES.TEXT) {
        return `\n  <section class="section section-text"${sectionStyleAttr}>\n    <p>${escapeHtml(section.text || '')}</p>\n  </section>`
      }

      if (section.type === SECTION_TYPES.IMAGE) {
        const imageStyle = [
          section.width ? `width:${section.width}%;` : '',
          section.height ? `height:${section.height}px; object-fit: cover;` : '',
          `transform: translateX(${section.offsetX || 0}px);`,
        ].join(' ')
        const imageJustify = imagePositionToJustify(section.position)

        return `\n  <section class="section section-image"${sectionStyleAttr}>\n    <figure class="image-figure position-${section.position || 'center'}">\n      <div style="display:flex; justify-content:${imageJustify}; width:100%;">\n        <img style="${imageStyle}" src="${escapeHtml(section.src || '')}" alt="${escapeHtml(section.alt || '')}" />\n      </div>\n      <figcaption>${escapeHtml(section.caption || '')}</figcaption>\n    </figure>\n  </section>`
      }

      if (section.type === SECTION_TYPES.BUTTON) {
        return `\n  <section class="section section-button"${sectionStyleAttr}>\n    <div class="button-positioner" style="position:relative; left:${section.offsetX || 0}px; top:${section.offsetY || 0}px;">\n      <a class="cta" href="${escapeHtml(section.href || '#')}">${escapeHtml(section.label || '')}</a>\n    </div>\n  </section>`
      }

      if (section.type === SECTION_TYPES.NAVIGATION) {
        const navLogoMarkup = (logo, enabled) =>
          enabled && logo?.src
            ? `<span class="nav-logo-circle"><img src="${escapeHtml(logo.src)}" alt="${escapeHtml(logo.alt || 'Logo')}" /></span>`
            : `<span class="nav-logo-circle nav-logo-hidden nav-logo-empty"></span>`
        const navAlignmentClass = `nav-align-${section.align || 'left'}`
        const navLinks = normalizeNavigationLinks(section.links)
        const navJustify = section.align === 'right' ? 'flex-end' : section.align === 'center' ? 'center' : 'flex-start'
        const navLinksStyle = `display:flex; flex-wrap:wrap; gap:8px; justify-content:${navJustify};`
        const navLinkStyle = 'display:inline-flex; align-items:center; justify-content:center; text-decoration:none; border:1px solid #111; background:#fff; color:#111; border-radius:999px; padding:7px 12px; font-weight:600;'
        const navLinksMarkup = navLinks
          .map(
            (link) =>
              `\n        <a class="nav-link-button" style="${navLinkStyle}" href="${escapeHtml(normalizeNavigationHrefForExport(link.href) || '#')}">${escapeHtml(link.label || '')}</a>`,
          )
          .join('')

        return `\n  <section class="section section-navigation"${sectionStyleAttr}>\n    <nav class="nav-layout ${navAlignmentClass}">\n      ${navLogoMarkup(section.logoLeft, section.logoLeftEnabled)}\n      <div class="nav-center">\n        <strong>${escapeHtml(section.title || 'Navigation')}</strong>\n        <div class="nav-links ${navAlignmentClass}" style="${navLinksStyle}">${navLinksMarkup}\n        </div>\n      </div>\n      ${navLogoMarkup(section.logoRight, section.logoRightEnabled)}\n    </nav>\n  </section>`
      }

      if (section.type === SECTION_TYPES.FOOTER) {
        return `\n  <section class="section section-footer"${sectionStyleAttr}>\n    <footer>${escapeHtml(section.text || '')}</footer>\n  </section>`
      }

      const nestedItemsMarkup = (section.nestedItems || [])
        .reduce((rows, item) => {
          const level = Number.isFinite(Number(item.level)) ? Number(item.level) : 0
          if (!rows[level]) {
            rows[level] = []
          }
          rows[level].push(item)
          return rows
        }, [])
        .filter(Boolean)
        .map((rowItems) => {
          const rowMarkup = rowItems
            .map((item) => {
              if (item.type === SECTION_TYPES.TEXT) {
                return `\n      <div class="nested-text" style="position:relative; left:${item.offsetX || 0}px; width:${getNestedTextWidth(item.width)}px; text-align:${item.align || 'left'};">\n        <p style="white-space:pre-wrap; overflow-wrap:anywhere; word-break:break-word; line-height:1.45;">${escapeHtml(item.text || '')}</p>\n      </div>`
              }

              const imageStyle = [
                item.width ? `width:${getNestedImageWidth(item.width)}px;` : '',
                item.height ? `height:${item.height}px; object-fit: cover;` : '',
              ].join(' ')

              return `\n      <figure class="nested-image">\n        <div style="display:flex; justify-content:${imagePositionToJustify(item.position)};">\n          <img style="${imageStyle}" src="${escapeHtml(item.src || '')}" alt="${escapeHtml(item.alt || '')}" />\n        </div>\n        <figcaption>${escapeHtml(item.caption || '')}</figcaption>\n      </figure>`
            })
            .join('')

          return `\n    <div class="nested-level-row">${rowMarkup}\n    </div>`
        })
        .join('')

      return `\n  <section class="section section-block"${sectionStyleAttr}>\n    <h4>${escapeHtml(section.title || '')}</h4>\n    <p>${escapeHtml(section.body || '')}</p>${nestedItemsMarkup}\n  </section>`
    })

  const spacerMarkup = '\n  <div class="export-drop-spacer" aria-hidden="true"></div>'
  const htmlSections = `${spacerMarkup}${sectionMarkup.join(spacerMarkup)}${spacerMarkup}`

  const floatingButtonsMarkup = floatingButtons
    .map((button) => {
      const buttonStyle = [
        'position:absolute;',
        `left:${button.offsetX || 0}px;`,
        `top:${button.offsetY || 0}px;`,
      ].join(' ')

      return `\n  <a class="floating-button" style="${buttonStyle}" href="${escapeHtml(button.href || '#')}">${escapeHtml(button.label || '')}</a>`
    })
    .join('')

  const floatingTextsMarkup = floatingTexts
    .map((textBox) => {
      const textStyle = [
        'position:absolute;',
        `left:${textBox.offsetX || 0}px;`,
        `top:${textBox.offsetY || 0}px;`,
        `width:${textBox.width || 280}px;`,
        `text-align:${textBox.align || 'left'};`,
      ].join(' ')

      return `\n  <div class="floating-text" style="${textStyle}"><p>${escapeHtml(textBox.text || '')}</p></div>`
    })
    .join('')

  const floatingImagesMarkup = floatingImages
    .map((imageBox) => {
      const imageStyle = [
        'position:absolute;',
        `left:${imageBox.offsetX || 0}px;`,
        `top:${imageBox.offsetY || 0}px;`,
        `width:${imageBox.width || 320}px;`,
      ].join(' ')

      const imgStyle = [
        'display:block;',
        'width:100%;',
        'border-radius:8px;',
        'object-fit:cover;',
        imageBox.height ? `height:${imageBox.height}px;` : '',
      ].join(' ')

      return `\n  <figure class="floating-image" style="${imageStyle}"><img style="${imgStyle}" src="${escapeHtml(imageBox.src || '')}" alt="${escapeHtml(imageBox.alt || '')}" /><figcaption>${escapeHtml(imageBox.caption || '')}</figcaption></figure>`
    })
    .join('')

  return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${escapeHtml(pageTitle || 'Generated Prototype')}</title>\n  <style>\n    * { box-sizing: border-box; }\n    body { margin: 0; font-family: Georgia, Cambria, 'Times New Roman', serif; color: #232323; background: #f8f8f8; }\n    main { width: 100%; margin: 0; padding: 18px; }\n    .preview-canvas { position: relative; min-height: calc(100vh - 80px); border: 2px dashed rgba(30, 30, 30, 0.25); border-radius: 8px; padding: 12px; background: rgba(255, 255, 255, 0.25); }\n    .export-drop-spacer { height: 38px; margin-bottom: 8px; visibility: hidden; }\n    .section { border: 1px solid #2f2f2f; border-radius: 8px; background: #fff; padding: 12px; margin-bottom: 8px; position: relative; }\n    .section h3, .section h4 { margin: 24px 0 6px; }\n    .section-header p, .section-text p, .section-block p, figcaption, .section-footer footer { margin: 0; line-height: 1.5; }\n    .section nav { display: grid; gap: 8px; margin-top: 24px; }\n    .section figure { margin: 24px 0 0; }\n    .image-figure { margin: 24px 0 0; display: grid; gap: 6px; }\n    .image-figure.position-left { justify-items: start; }\n    .image-figure.position-center { justify-items: center; }\n    .image-figure.position-right { justify-items: end; }\n    .section-image img { display: block; border-radius: 8px; object-fit: cover; max-height: 420px; margin-bottom: 8px; }\n    .section-button .cta { display: inline-flex; text-decoration: none; background: #111; color: #fff; border-radius: 999px; padding: 8px 14px; font-weight: 600; }\n    .nav-layout { display: grid; grid-template-columns: 64px minmax(0, 1fr) 64px; align-items: center; gap: 16px; width: 100%; }\n    .nav-center { min-width: 0; display: grid; justify-items: center; gap: 4px; text-align: center; }\n    .nav-links { font-size: 0.95rem; color: #333; }\n    .floating-button { display: inline-flex; position: absolute; z-index: 20; text-decoration: none; background: #111; color: #fff; border-radius: 999px; padding: 8px 14px; font-weight: 600; }\n    .floating-text { position: absolute; z-index: 20; border: 1px solid #111; border-radius: 8px; background: #fff; padding: 10px 12px; }\n    .floating-text p { margin: 0; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; }\n    .floating-image { position: absolute; z-index: 20; margin: 0; }\n    .floating-image figcaption { margin: 6px 0 0; }\n  </style>\n</head>\n<body>\n  <main>\n    <div class="preview-canvas">${htmlSections}${floatingButtonsMarkup}${floatingTextsMarkup}${floatingImagesMarkup}\n    </div>\n  </main>\n</body>\n</html>`
}

export const downloadTextFile = (filename, content, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const createSafeHtmlFilename = (name) => {
  const cleaned = String(name || 'webpagebuilder')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${cleaned || 'webpagebuilder'}.html`
}

export const exportHtmlFile = ({ pageName, pageTitle, htmlPreview }) => {
  const filename = createSafeHtmlFilename(pageName || pageTitle)
  downloadTextFile(filename, htmlPreview, 'text/html')
}

export const exportLayoutFile = ({ activePageId, pages, normalizePage }) => {
  const layout = {
    activePageId,
    pages: pages.map(normalizePage),
    exportedAt: new Date().toISOString(),
  }

  downloadTextFile('webbuilder-layout.json', JSON.stringify(layout, null, 2), 'application/json')
}
