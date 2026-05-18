export const createNavigationLink = (label = 'Link', href = '#') => ({
  id: `nav-link-${crypto.randomUUID()}`,
  label,
  href,
})

const slugifyNavigationFilename = (label) => {
  const slug = String(label || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug ? `${slug}.html` : '#'
}

const normalizeNavigationLink = (link, index = 0) => {
  if (typeof link === 'string') {
    const label = link.trim() || `Link ${index + 1}`
    return createNavigationLink(label, slugifyNavigationFilename(label))
  }

  if (!link || typeof link !== 'object') {
    return createNavigationLink(`Link ${index + 1}`, '#')
  }

  const label = String(link.label || link.text || link.title || `Link ${index + 1}`).trim() || `Link ${index + 1}`
  const href = String(link.href || slugifyNavigationFilename(label) || '#').trim() || '#'

  return {
    id: link.id || `nav-link-${crypto.randomUUID()}`,
    label,
    href,
  }
}

export const normalizeNavigationLinks = (links) => {
  if (Array.isArray(links)) {
    return links.map((link, index) => normalizeNavigationLink(link, index))
  }

  if (typeof links === 'string' && links.trim()) {
    return links
      .split(',')
      .map((entry, index) => normalizeNavigationLink(entry, index))
      .filter((link) => link.label)
  }

  return [
    createNavigationLink('Home', 'home.html'),
    createNavigationLink('About Us', 'about-us.html'),
    createNavigationLink('Services', 'services.html'),
    createNavigationLink('Contact', 'contact.html'),
  ]
}

export const normalizeNavigationHrefInput = (href) => {
  const value = String(href || '').trim()

  if (!value) {
    return ''
  }

  if (
    value.startsWith('#') ||
    value.startsWith('/') ||
    value.startsWith('./') ||
    value.startsWith('../') ||
    value.includes('?') ||
    value.includes('#') ||
    value.includes('.') ||
    /^[a-z]+:\/\//i.test(value) ||
    /^[a-z]+:/i.test(value)
  ) {
    return value
  }

  return `${value}.html`
}

export const normalizeNavigationHrefForExport = (href) => {
  const normalizedHref = normalizeNavigationHrefInput(href)

  if (normalizedHref === '#') {
    return '#'
  }

  if (normalizedHref.startsWith('#')) {
    const hashSlug = normalizedHref
      .slice(1)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return hashSlug ? `${hashSlug}.html` : '#'
  }

  return normalizedHref
}
