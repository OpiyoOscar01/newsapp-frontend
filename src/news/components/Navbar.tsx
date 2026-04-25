// src/components/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Newspaper,
  TrendingUp,
  FileText,
  Globe,
  Briefcase,
  Tv,
  Beaker,
  Trophy,
  Sparkles,
  Heart,
  Search,
  UserCircle2,
} from 'lucide-react';
import { dataService } from '../data/dataService';
import { type Category } from '../types/news';
import { ROUTES } from '../routes/routes';
import { useAppSelector } from '../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectUser } from '../../features/authentication/store/slices/authSlice';
import { useLogout } from '../api/auth/AuthQueries';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      setIsMobileMenuOpen(false);
      navigate(ROUTES.HOME);
    },
    onError: () => {
      setIsMobileMenuOpen(false);
      navigate(ROUTES.HOME);
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesData = await dataService.getCategories();
        setCategories(categoriesData.length === 0 ? [] : categoriesData);
      } catch {
        setCategories([]);
        setError('Failed to load navigation');
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearch = (query: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    if (query.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(ROUTES.SEARCH);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => logout();

  const handleAdminDashboard = () => {
    navigate(ROUTES.ADMIN_DASHBOARD);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const getCategoryIcon = (categoryName: string, index: number) => {
    const iconMap: { [key: string]: React.ElementType } = {
      general: Sparkles,
      technology: TrendingUp,
      business: Briefcase,
      sports: Trophy,
      science: Beaker,
      entertainment: Tv,
      world: Globe,
      health: Heart,
    };
    const IconComponent = iconMap[categoryName.toLowerCase()];
    if (IconComponent) return <IconComponent className="w-4 h-4" />;
    const fallbacks = [Globe, Briefcase, Tv, Beaker, Trophy, Newspaper, FileText];
    const FallbackIcon = fallbacks[index % fallbacks.length];
    return <FallbackIcon className="w-4 h-4" />;
  };

  const sortedCategories = (() => {
    const general = categories.find((c) => c.slug === 'general');
    const rest = categories.filter((c) => c.slug !== 'general');
    return general ? [general, ...rest] : rest;
  })();

  const userInitial =
    user?.first_name?.charAt(0).toUpperCase() ||
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    'U';

  const userDisplayName =
    user?.first_name || user?.name || user?.email?.split('@')[0];

  if (loading) {
    return (
      <nav className="dp-nav">
        <div className="dp-nav__inner">
          <span className="dp-logo">Define<span>Press</span></span>
          <div className="dp-skeleton-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="dp-skeleton-pill" />
            ))}
          </div>
        </div>
        <style>{CSS}</style>
      </nav>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <header className="dp-header">
        {/* ── Top Bar ── */}
        <nav className="dp-nav" role="navigation" aria-label="Main navigation">
          <div className="dp-nav__inner">

            {/* Logo */}
            <Link to={ROUTES.HOME} className="dp-logo" aria-label="DefinePress home">
              Define<span>Press</span>
            </Link>

            {/* Desktop category links */}
            <ul className="dp-nav__links" role="list">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className={`dp-nav__link ${isActiveRoute(ROUTES.HOME) ? 'dp-nav__link--active' : ''}`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
              </li>
              {sortedCategories.map((cat, idx) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`dp-nav__link dp-nav__link--cat ${
                      isActiveRoute(`/category/${cat.slug}`) ? 'dp-nav__link--active' : ''
                    }`}
                  >
                    {getCategoryIcon(cat.name, idx)}
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="dp-nav__actions">
              {/* Search toggle */}
              <button
                className={`dp-icon-btn ${isSearchOpen ? 'dp-icon-btn--active' : ''}`}
                onClick={() => setIsSearchOpen((v) => !v)}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={isSearchOpen}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Auth */}
              {isAuthenticated && user ? (
                <div className="dp-user-menu">
                  <button className="dp-user-btn" aria-haspopup="true">
                    <span className="dp-avatar">{userInitial}</span>
                    <span className="dp-user-name">{userDisplayName}</span>
                    <ChevronDown className="w-3.5 h-3.5 dp-chevron" />
                  </button>
                  <div className="dp-dropdown" role="menu">
                    <div className="dp-dropdown__header">
                      <span className="dp-dropdown__label">Signed in as</span>
                      <span className="dp-dropdown__email">{user.email}</span>
                    </div>
                    {user.is_admin && (
                      <button
                        className="dp-dropdown__item"
                        onClick={handleAdminDashboard}
                        role="menuitem"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                    )}
                    <button
                      className="dp-dropdown__item dp-dropdown__item--danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to={ROUTES.REGISTER} className="dp-account-btn">
                  <UserCircle2 className="w-4 h-4" />
                  Account
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="dp-hamburger"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        {/* ── Search Drop-down Bar ── */}
        <div className={`dp-searchbar ${isSearchOpen ? 'dp-searchbar--open' : ''}`} aria-hidden={!isSearchOpen}>
          <div className="dp-searchbar__inner">
            <Search className="dp-searchbar__icon w-5 h-5" aria-hidden />
            <input
              ref={searchInputRef}
              type="text"
              className="dp-searchbar__input"
              placeholder="Search articles, topics, authors…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
              }}
              tabIndex={isSearchOpen ? 0 : -1}
            />
            <button
              className="dp-searchbar__submit"
              onClick={() =>
                handleSearch((searchInputRef.current?.value ?? ''))
              }
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {isMobileMenuOpen && (
        <>
          <div
            className="dp-mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="dp-mobile-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="dp-mobile-panel__head">
              <Link to={ROUTES.HOME} className="dp-logo" onClick={() => setIsMobileMenuOpen(false)}>
                Define<span>Press</span>
              </Link>
              <button
                className="dp-icon-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="dp-mobile-search">
              <Search className="dp-mobile-search__icon w-4 h-4" />
              <input
                type="search"
                className="dp-mobile-search__input"
                placeholder="Search…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
                }}
              />
            </div>

            {/* User info strip */}
            {isAuthenticated && user && (
              <div className="dp-mobile-user">
                <span className="dp-avatar dp-avatar--lg">{userInitial}</span>
                <div>
                  <p className="dp-mobile-user__name">{userDisplayName}</p>
                  <p className="dp-mobile-user__email">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <nav className="dp-mobile-nav">
              <Link
                to={ROUTES.HOME}
                className={`dp-mobile-link ${isActiveRoute(ROUTES.HOME) ? 'dp-mobile-link--active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" /> Home
              </Link>
              {sortedCategories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`dp-mobile-link dp-mobile-link--cat ${
                    isActiveRoute(`/category/${cat.slug}`) ? 'dp-mobile-link--active' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getCategoryIcon(cat.name, idx)} {cat.name}
                </Link>
              ))}
            </nav>

            {/* Mobile auth */}
            <div className="dp-mobile-auth">
              {isAuthenticated && user ? (
                <>
                  {user.is_admin && (
                    <button className="dp-mobile-link" onClick={handleAdminDashboard}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                  )}
                  <button className="dp-mobile-link dp-mobile-link--danger" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="dp-mobile-btn dp-mobile-btn--ghost"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="dp-mobile-btn dp-mobile-btn--primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>

            <p className="dp-mobile-footer">© {new Date().getFullYear()} DefinePress</p>
          </div>
        </>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   Scoped CSS — all prefixed with dp-
───────────────────────────────────────────── */
const CSS = `
  /* ── Tokens ── */
  :root {
    --dp-ink: #111827;
    --dp-ink-soft: #6b7280;
    --dp-accent: #1d4ed8;
    --dp-accent-hover: #1e40af;
    --dp-surface: #ffffff;
    --dp-border: #e5e7eb;
    --dp-highlight: #eff6ff;
    --dp-danger: #dc2626;
    --dp-danger-bg: #fef2f2;
    --dp-shadow: 0 1px 3px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
    --dp-shadow-md: 0 4px 12px rgba(0,0,0,.10);
    --dp-radius: 6px;
    --dp-font: 'Georgia', 'Times New Roman', serif;
    --dp-font-ui: system-ui, -apple-system, sans-serif;
    --dp-nav-h: 56px;
    --dp-search-h: 56px;
  }

  /* ── Header wrapper ── */
  .dp-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--dp-surface);
    border-bottom: 1px solid var(--dp-border);
    box-shadow: var(--dp-shadow);
  }

  /* ── Main nav bar ── */
  .dp-nav {
    height: var(--dp-nav-h);
  }
  .dp-nav__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.25rem;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0;
  }

  /* ── Logo ── */
  .dp-logo {
    font-family: var(--dp-font);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--dp-ink);
    text-decoration: none;
    letter-spacing: -.5px;
    white-space: nowrap;
    flex-shrink: 0;
    margin-right: 1.5rem;
  }
  .dp-logo span { color: var(--dp-accent); }

  /* ── Desktop nav links ── */
  .dp-nav__links {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    align-items: center;
    gap: 0;
    overflow: hidden;
  }
  @media (min-width: 768px) {
    .dp-nav__links { display: flex; }
  }

  .dp-nav__link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    height: var(--dp-nav-h);
    font-family: var(--dp-font-ui);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: .02em;
    text-transform: uppercase;
    color: var(--dp-ink-soft);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: color .15s, border-color .15s;
    white-space: nowrap;
  }
  .dp-nav__link:hover {
    color: var(--dp-accent);
    border-bottom-color: var(--dp-accent);
  }
  .dp-nav__link--active {
    color: var(--dp-accent);
    border-bottom-color: var(--dp-accent);
  }
  .dp-nav__link--cat {
    font-weight: 500;
    text-transform: capitalize;
    font-size: 0.8rem;
    letter-spacing: 0;
  }

  /* ── Right action cluster ── */
  .dp-nav__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── Icon button (search, close) ── */
  .dp-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--dp-radius);
    border: none;
    background: transparent;
    color: var(--dp-ink-soft);
    cursor: pointer;
    transition: background .15s, color .15s;
  }
  .dp-icon-btn:hover,
  .dp-icon-btn--active {
    background: var(--dp-highlight);
    color: var(--dp-accent);
  }

  /* ── Account button ── */
  .dp-account-btn {
    display: none;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
    height: 34px;
    border-radius: var(--dp-radius);
    background: var(--dp-accent);
    color: #fff;
    font-family: var(--dp-font-ui);
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition: background .15s;
    white-space: nowrap;
  }
  .dp-account-btn:hover { background: var(--dp-accent-hover); }
  @media (min-width: 640px) { .dp-account-btn { display: inline-flex; } }

  /* ── User menu ── */
  .dp-user-menu {
    position: relative;
    display: none;
  }
  @media (min-width: 640px) { .dp-user-menu { display: block; } }

  .dp-user-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 10px 5px 6px;
    border-radius: var(--dp-radius);
    border: 1px solid var(--dp-border);
    background: transparent;
    color: var(--dp-ink);
    font-family: var(--dp-font-ui);
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
  }
  .dp-user-btn:hover { background: var(--dp-highlight); }

  .dp-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--dp-highlight);
    color: var(--dp-accent);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dp-avatar--lg { width: 38px; height: 38px; font-size: 1rem; }

  .dp-user-name { display: none; }
  @media (min-width: 1024px) { .dp-user-name { display: block; } }

  .dp-chevron { color: var(--dp-ink-soft); }

  .dp-dropdown {
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    width: 210px;
    background: var(--dp-surface);
    border: 1px solid var(--dp-border);
    border-radius: var(--dp-radius);
    box-shadow: var(--dp-shadow-md);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-6px);
    transition: opacity .15s, transform .15s, visibility .15s;
    z-index: 200;
  }
  .dp-user-menu:hover .dp-dropdown,
  .dp-user-menu:focus-within .dp-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .dp-dropdown__header {
    padding: 10px 14px;
    border-bottom: 1px solid var(--dp-border);
  }
  .dp-dropdown__label {
    display: block;
    font-size: 0.7rem;
    font-family: var(--dp-font-ui);
    color: var(--dp-ink-soft);
    text-transform: uppercase;
    letter-spacing: .05em;
    margin-bottom: 2px;
  }
  .dp-dropdown__email {
    display: block;
    font-size: 0.82rem;
    font-family: var(--dp-font-ui);
    font-weight: 600;
    color: var(--dp-ink);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dp-dropdown__item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 9px 14px;
    border: none;
    background: none;
    font-family: var(--dp-font-ui);
    font-size: 0.83rem;
    color: var(--dp-ink);
    cursor: pointer;
    transition: background .12s;
    text-align: left;
  }
  .dp-dropdown__item:hover { background: var(--dp-highlight); }
  .dp-dropdown__item--danger { color: var(--dp-danger); }
  .dp-dropdown__item--danger:hover { background: var(--dp-danger-bg); }

  /* ── Hamburger (mobile only) ── */
  .dp-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--dp-radius);
    border: none;
    background: transparent;
    color: var(--dp-ink);
    cursor: pointer;
  }
  .dp-hamburger:hover { background: var(--dp-highlight); }
  @media (min-width: 768px) { .dp-hamburger { display: none; } }

  /* ── Search drop-down bar ── */
  .dp-searchbar {
    overflow: hidden;
    max-height: 0;
    border-top: 0 solid var(--dp-border);
    transition: max-height .28s cubic-bezier(0.4, 0, 0.2, 1),
                border-top-width .28s;
    background: #f9fafb;
  }
  .dp-searchbar--open {
    max-height: var(--dp-search-h);
    border-top-width: 1px;
  }
  .dp-searchbar__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.25rem;
    height: var(--dp-search-h);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dp-searchbar__icon { color: var(--dp-ink-soft); flex-shrink: 0; }
  .dp-searchbar__input {
    flex: 1;
    border: none;
    background: none;
    font-family: var(--dp-font-ui);
    font-size: 0.95rem;
    color: var(--dp-ink);
    outline: none;
  }
  .dp-searchbar__input::placeholder { color: var(--dp-ink-soft); }
  .dp-searchbar__submit {
    padding: 6px 16px;
    border-radius: var(--dp-radius);
    border: none;
    background: var(--dp-accent);
    color: #fff;
    font-family: var(--dp-font-ui);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background .15s;
  }
  .dp-searchbar__submit:hover { background: var(--dp-accent-hover); }


  /* ── Mobile overlay ── */
  .dp-mobile-backdrop {
    position: fixed;
    inset: 0;
    z-index: 110;
    background: rgba(0,0,0,.4);
    animation: dpFadeIn .2s ease;
  }
  .dp-mobile-panel {
    position: fixed;
    inset-y: 0;
    right: 0;
    z-index: 120;
    width: min(340px, 92vw);
    background: var(--dp-surface);
    display: flex;
    flex-direction: column;
    animation: dpSlideIn .28s cubic-bezier(0.16, 1, 0.3, 1);
    overflow-y: auto;
  }

  .dp-mobile-panel__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    height: 56px;
    border-bottom: 1px solid var(--dp-border);
    flex-shrink: 0;
  }

  /* Mobile search */
  .dp-mobile-search {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 1rem;
    padding: 0 12px;
    height: 40px;
    background: #f3f4f6;
    border-radius: var(--dp-radius);
  }
  .dp-mobile-search__icon { color: var(--dp-ink-soft); flex-shrink: 0; }
  .dp-mobile-search__input {
    flex: 1;
    border: none;
    background: none;
    font-family: var(--dp-font-ui);
    font-size: 0.88rem;
    color: var(--dp-ink);
    outline: none;
  }
  .dp-mobile-search__input::placeholder { color: var(--dp-ink-soft); }

  /* Mobile user strip */
  .dp-mobile-user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 1rem 8px;
    padding: 10px 12px;
    background: var(--dp-highlight);
    border-radius: var(--dp-radius);
  }
  .dp-mobile-user__name {
    font-family: var(--dp-font-ui);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--dp-ink);
    margin: 0;
  }
  .dp-mobile-user__email {
    font-family: var(--dp-font-ui);
    font-size: 0.75rem;
    color: var(--dp-ink-soft);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Mobile nav links */
  .dp-mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 0 0.75rem;
    gap: 2px;
    flex: 1;
  }
  .dp-mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--dp-radius);
    font-family: var(--dp-font-ui);
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--dp-ink);
    text-decoration: none;
    border: none;
    background: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: background .12s, color .12s;
    text-transform: capitalize;
  }
  .dp-mobile-link:hover { background: var(--dp-highlight); color: var(--dp-accent); }
  .dp-mobile-link--active { background: var(--dp-highlight); color: var(--dp-accent); font-weight: 600; }
  .dp-mobile-link--danger { color: var(--dp-danger); }
  .dp-mobile-link--danger:hover { background: var(--dp-danger-bg); color: var(--dp-danger); }

  /* Mobile auth */
  .dp-mobile-auth {
    padding: 12px 0.75rem;
    margin-top: 4px;
    border-top: 1px solid var(--dp-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .dp-mobile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: var(--dp-radius);
    font-family: var(--dp-font-ui);
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: background .15s;
  }
  .dp-mobile-btn--ghost {
    background: none;
    border: 1px solid var(--dp-border);
    color: var(--dp-ink);
  }
  .dp-mobile-btn--ghost:hover { background: var(--dp-highlight); }
  .dp-mobile-btn--primary {
    background: var(--dp-accent);
    color: #fff;
    border: none;
  }
  .dp-mobile-btn--primary:hover { background: var(--dp-accent-hover); }

  /* Mobile footer */
  .dp-mobile-footer {
    text-align: center;
    font-family: var(--dp-font-ui);
    font-size: 0.72rem;
    color: var(--dp-ink-soft);
    padding: 12px;
    border-top: 1px solid var(--dp-border);
    margin: 0;
  }

  /* Loading skeleton */
  .dp-skeleton-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .dp-skeleton-pill {
    height: 18px;
    width: 64px;
    border-radius: 4px;
    background: #e5e7eb;
    animation: dpPulse 1.5s ease-in-out infinite;
  }

  /* ── Animations ── */
  @keyframes dpFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dpSlideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }
  @keyframes dpPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }
`;

export default Navbar;