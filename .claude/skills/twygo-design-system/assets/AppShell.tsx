import { CSSProperties, MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import './twygo-ui.css'

export type ShellNavItem = {
  key: string
  label: string
  href: string
  icon: string
  betaBadge?: boolean
  newBadge?: boolean
  children?: ShellNavItem[]
}

export type ShellNavModule = {
  key: string
  label: string
  icon: string
  items: ShellNavItem[]
}

export type AppShellProps = {
  modules: ShellNavModule[]
  currentPath: string
  brand: { name: string; logoUrl?: string }
  user: { name: string; avatarUrl?: string }
  primaryColor?: string
  onNavigate?: (href: string) => void
  onAccountClick?: () => void
  children: ReactNode
}

const COLLAPSED_STORAGE_KEY = 'twygo:menu:collapsed'

const isActivePath = (currentPath: string, href: string) =>
  currentPath === href || currentPath.startsWith(`${href}/`)

const hasActiveDescendant = (item: ShellNavItem, currentPath: string): boolean =>
  isActivePath(currentPath, item.href) || (item.children ?? []).some((child) => hasActiveDescendant(child, currentPath))

const initialsFrom = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`twg-icon ${className}`} aria-hidden='true'>
    {name}
  </span>
)

const readCollapsed = () => {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const AppShell = ({
  modules,
  currentPath,
  brand,
  user,
  primaryColor,
  onNavigate,
  onAccountClick,
  children
}: AppShellProps) => {
  const activeModuleFromPath = useMemo(
    () => modules.find((module) => module.items.some((item) => hasActiveDescendant(item, currentPath))) ?? modules[0],
    [modules, currentPath]
  )
  const [selectedModuleKey, setSelectedModuleKey] = useState(activeModuleFromPath?.key)
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  useEffect(() => setSelectedModuleKey(activeModuleFromPath?.key), [activeModuleFromPath])

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(isCollapsed))
    } catch {
      return
    }
  }, [isCollapsed])

  const selectedModule = modules.find((module) => module.key === selectedModuleKey) ?? modules[0]
  const quickItems = selectedModule.items.flatMap((item) => (item.children?.length ? item.children : [item])).slice(0, 3)
  const shellStyle = primaryColor ? ({ '--twg-primary': primaryColor } as CSSProperties) : undefined

  const navigate = (href: string) => (event: MouseEvent) => {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(href)
    setIsMobileSheetOpen(false)
  }

  const renderLeaf = (item: ShellNavItem) => (
    <a
      key={item.key}
      href={item.href}
      onClick={navigate(item.href)}
      className={`twg-nav-item ${isCollapsed ? 'twg-tooltip' : ''}`}
      data-tip={isCollapsed ? item.label : undefined}
      aria-current={isActivePath(currentPath, item.href) ? 'page' : undefined}
      data-test-id={`shell-nav-${item.key}-link`}
    >
      <Icon name={item.icon || 'circle'} />
      <span className='twg-nav-item__label'>{item.label}</span>
      {item.betaBadge && <span className='twg-nav-badge twg-nav-badge--beta'>beta</span>}
      {item.newBadge && <span className='twg-nav-badge twg-nav-badge--new'>novo</span>}
    </a>
  )

  const renderItems = (items: ShellNavItem[]) =>
    items.map((item) =>
      item.children?.length ? (
        <NavGroup key={item.key} item={item} currentPath={currentPath} isCollapsed={isCollapsed} renderLeaf={renderLeaf} />
      ) : (
        renderLeaf(item)
      )
    )

  const hasSingleModule = modules.length === 1

  return (
    <div className='twg-shell' style={shellStyle}>
      <nav className='twg-shell__nav' aria-label='Menu principal'>
        <div className={`twg-rail ${hasSingleModule ? 'twg-rail--strip' : ''}`}>
          {!hasSingleModule &&
            modules.map((module) => (
              <button
                key={module.key}
                type='button'
                className='twg-rail__item twg-tooltip'
                data-tip={module.label}
                aria-label={module.label}
                aria-current={module.key === selectedModule.key ? 'true' : undefined}
                onClick={() => setSelectedModuleKey(module.key)}
                data-test-id={`shell-module-${module.key}-button`}
              >
                <Icon name={module.icon || 'grid_view'} />
              </button>
            ))}
        </div>

        <div className={`twg-panel ${isCollapsed ? 'twg-panel--collapsed' : ''}`}>
          <div className='twg-panel__brand' style={isCollapsed ? { justifyContent: 'center', padding: '12px 8px 8px' } : undefined}>
            {isCollapsed ? (
              <span
                style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--twg-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >
                {brand.name[0]}
              </span>
            ) : brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} />
            ) : (
              <span className='twg-panel__brand-name'>{brand.name}</span>
            )}
          </div>

          <div className='twg-panel__header'>
            <span className='twg-panel__module-title'>{selectedModule.label}</span>
            <button
              type='button'
              className='twg-panel__toggle'
              aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
              onClick={() => setIsCollapsed((value) => !value)}
              data-test-id='shell-collapse-toggle-button'
            >
              <Icon name='chevron_right' />
            </button>
          </div>

          <div className='twg-panel__items'>{renderItems(selectedModule.items)}</div>

          <div className='twg-panel__footer'>
            <div className='twg-utility-actions'>
              <button type='button' className='twg-utility-action' aria-label='Notificações'>
                <Icon name='notifications' />
              </button>
            </div>
            <button type='button' className='twg-account' onClick={onAccountClick} data-test-id='shell-account-button'>
              {user.avatarUrl ? (
                <img className='twg-avatar' src={user.avatarUrl} alt='' />
              ) : (
                <span className='twg-avatar'>{initialsFrom(user.name)}</span>
              )}
              <span className='twg-account__name'>{user.name}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className='twg-shell__content'>{children}</main>

      <nav className='twg-bottom-nav' aria-label='Menu rápido'>
        {quickItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            onClick={navigate(item.href)}
            className='twg-bottom-nav__item'
            aria-current={isActivePath(currentPath, item.href) ? 'page' : undefined}
          >
            <span className='twg-bottom-nav__icon'>
              <Icon name={item.icon} />
            </span>
            {item.label}
          </a>
        ))}
        <button type='button' className='twg-bottom-nav__item' onClick={() => setIsMobileSheetOpen(true)} data-test-id='shell-mobile-more-button'>
          <span className='twg-bottom-nav__icon'>
            <Icon name='more_horiz' />
          </span>
          Mais
        </button>
      </nav>

      {isMobileSheetOpen && (
        <>
          <div className='twg-overlay' onClick={() => setIsMobileSheetOpen(false)} />
          <div
            role='dialog'
            aria-label='Menu'
            style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 'min(88dvh, 720px)', background: '#fff', borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 32px rgba(15,23,42,.18)', zIndex: 4000, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#d1d5db', margin: '8px auto' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Menu</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Navegue pela plataforma</div>
              </div>
              <button type='button' className='twg-close' style={{ borderRadius: '50%', background: '#f1f5f9' }} aria-label='Fechar' onClick={() => setIsMobileSheetOpen(false)}>
                <Icon name='close' />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, padding: '8px 16px', overflowX: 'auto' }}>
              {modules.map((module) => (
                <button
                  key={module.key}
                  type='button'
                  className={module.key === selectedModule.key ? 'twg-btn twg-btn--sm twg-btn--primary' : 'twg-btn twg-btn--sm twg-btn--outline'}
                  onClick={() => setSelectedModuleKey(module.key)}
                >
                  <Icon name={module.icon} />
                  {module.label}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>{renderItems(selectedModule.items)}</div>
          </div>
        </>
      )}
    </div>
  )
}

type NavGroupProps = {
  item: ShellNavItem
  currentPath: string
  isCollapsed: boolean
  renderLeaf: (item: ShellNavItem) => ReactNode
}

const NavGroup = ({ item, currentPath, isCollapsed, renderLeaf }: NavGroupProps) => {
  const containsActive = hasActiveDescendant(item, currentPath)
  const [isOpen, setIsOpen] = useState(containsActive)

  if (isCollapsed) return <>{(item.children ?? []).map(renderLeaf)}</>

  return (
    <div>
      <button
        type='button'
        className={`twg-nav-item ${!isOpen && containsActive ? 'twg-nav-item--active-parent' : ''}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        data-test-id={`shell-nav-${item.key}-group`}
      >
        <Icon name={item.icon || 'folder'} />
        <span className='twg-nav-item__label'>{item.label}</span>
        <Icon name={isOpen ? 'expand_more' : 'chevron_right'} className='twg-nav-item__chevron' />
      </button>
      <div className='twg-nav-group__children' hidden={!isOpen}>
        {(item.children ?? []).map(renderLeaf)}
      </div>
    </div>
  )
}

export default AppShell
