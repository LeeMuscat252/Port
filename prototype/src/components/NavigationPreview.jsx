import { normalizeNavigationLinks } from '../navigationUtils'

export default function NavigationPreview({ section }) {
  return (
    <nav className={`nav-layout nav-align-${section.align || 'left'}`}>
      <span className={`nav-logo-circle ${section.logoLeftEnabled ? '' : 'nav-logo-hidden'} ${section.logoLeft?.src ? 'has-logo' : 'nav-logo-empty'}`}>
        {section.logoLeftEnabled && section.logoLeft?.src ? <img src={section.logoLeft.src} alt={section.logoLeft.alt || 'Logo'} /> : null}
      </span>
      <div className="nav-center">
        <strong>{section.title}</strong>
        <div className={`preview-links nav-align-${section.align || 'left'}`}>
          {normalizeNavigationLinks(section.links).map((link) => (
            <a
              key={link.id}
              className="nav-link-button"
              href={link.href || '#'}
              onClick={(event) => event.preventDefault()}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <span className={`nav-logo-circle ${section.logoRightEnabled ? '' : 'nav-logo-hidden'} ${section.logoRight?.src ? 'has-logo' : 'nav-logo-empty'}`}>
        {section.logoRightEnabled && section.logoRight?.src ? <img src={section.logoRight.src} alt={section.logoRight.alt || 'Logo'} /> : null}
      </span>
    </nav>
  )
}
