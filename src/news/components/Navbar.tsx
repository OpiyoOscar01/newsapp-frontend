// src/components/Navbar.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Menu, X, LayoutDashboard, LogOut, ChevronDown,
  Newspaper, TrendingUp, FileText, Globe, Briefcase, Tv,
  Beaker, Trophy, Sparkles, Heart, Search, UserCircle2,
} from 'lucide-react';
import { dataService } from '../data/dataService';
import { type Category } from '../types/news';
import { ROUTES } from '../routes/routes';
import { useAppSelector } from '../../shared/hooks/useRedux';
import { selectIsAuthenticated, selectUser } from '../../features/authentication/store/slices/authSlice';
import { useLogout } from '../api/auth/AuthQueries';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]         = useState(false);
  const [categories, setCategories]             = useState<Category[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [, setError]                            = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const location       = useLocation();
  const navigate       = useNavigate();

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user            = useAppSelector(selectUser);

  const { mutate: logout } = useLogout({
    onSuccess: () => { setIsMobileMenuOpen(false); navigate(ROUTES.HOME); },
    onError:   () => { setIsMobileMenuOpen(false); navigate(ROUTES.HOME); },
  });

  /* ── Data ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const data = await dataService.getCategories();
        setCategories(data);
      } catch {
        setCategories([]); setError('Failed to load navigation');
      } finally { setLoading(false); }
    })();
  }, []);

  const sortedCategories = useMemo(() => {
    const general = categories.find((c) => c.slug === 'general');
    const rest    = categories.filter((c) => c.slug !== 'general').sort((a, b) => a.name.localeCompare(b.name));
    return general ? [general, ...rest] : rest;
  }, [categories]);

  /* ── Side-effects ── */
  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [isSearchOpen]);

  useEffect(() => {
    setIsSearchOpen(false); setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setIsMobileMenuOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* ── Handlers ── */
  const handleSearch = (query: string) => {
    setIsSearchOpen(false); setIsMobileMenuOpen(false);
    navigate(query.trim() ? `${ROUTES.SEARCH}?q=${encodeURIComponent(query.trim())}` : ROUTES.SEARCH);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout         = () => logout();
  const handleAdminDashboard = () => { navigate(ROUTES.ADMIN_DASHBOARD); setIsMobileMenuOpen(false); };
  const isActive             = (path: string) => location.pathname === path;
  const isCatActive          = (slug: string) => location.pathname === `/category/${slug}`;

  /* ── Icon map ── */
  const getCategoryIcon = (name: string, idx: number) => {
    const map: Record<string, React.ElementType> = {
      general: Sparkles, technology: TrendingUp, business: Briefcase,
      sports: Trophy, science: Beaker, entertainment: Tv, world: Globe, health: Heart,
    };
    const fallbacks: React.ElementType[] = [Globe, Briefcase, Tv, Beaker, Trophy, Newspaper, FileText];
    const Icon = map[name.toLowerCase()] ?? fallbacks[idx % fallbacks.length];
    return <Icon className="w-3.5 h-3.5 shrink-0" />;
  };

  /* ── User helpers ── */
  const userInitial     = user?.first_name?.charAt(0).toUpperCase() ?? user?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U';
  const userDisplayName = user?.first_name ?? user?.name ?? user?.email?.split('@')[0] ?? 'User';

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <header className="dp-header">
          <div className="dp-topbar">
            <div className="dp-topbar__inner">
              <span className="dp-logo">Define<span>Press</span></span>
              <div className="dp-skeleton-row">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="dp-skeleton-pill" />)}
              </div>
            </div>
          </div>
          <div className="dp-rail dp-rail--loading">
            {Array.from({ length: 7 }).map((_, i) => <div key={i} className="dp-skeleton-chip" />)}
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      <header className="dp-header">

        {/* ════ Row 1 — Logo + Actions ════ */}
        <div className="dp-topbar">
          <div className="dp-topbar__inner">

            <Link to={ROUTES.HOME} className="dp-logo" aria-label="DefinePress home">
              Define<span>Press</span>
            </Link>

            <div className="dp-actions">
              {/* Search toggle */}
              <button
                className={`dp-icon-btn${isSearchOpen ? ' dp-icon-btn--active' : ''}`}
                onClick={() => setIsSearchOpen(v => !v)}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={isSearchOpen}
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Auth (desktop only) */}
              <div className="dp-auth">
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
                        <button className="dp-dropdown__item" onClick={handleAdminDashboard} role="menuitem">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                      )}
                      <button className="dp-dropdown__item dp-dropdown__item--danger" onClick={handleLogout} role="menuitem">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to={ROUTES.REGISTER} className="dp-account-btn">
                    <UserCircle2 className="w-4 h-4" /> Account
                  </Link>
                )}
              </div>

              {/* Hamburger (mobile only) */}
              <button
                className="dp-hamburger"
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ════ Search slide-down bar ════ */}
        <div
          className={`dp-searchbar${isSearchOpen ? ' dp-searchbar--open' : ''}`}
          aria-hidden={!isSearchOpen}
        >
          <div className="dp-searchbar__inner">
            <Search className="w-4 h-4 dp-searchbar__icon" aria-hidden />
            <input
              ref={searchInputRef}
              type="text"
              className="dp-searchbar__input"
              placeholder="Search articles, topics, authors…"
              tabIndex={isSearchOpen ? 0 : -1}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value); }}
            />
            <button
              className="dp-searchbar__submit"
              onClick={() => handleSearch(searchInputRef.current?.value ?? '')}
            >
              Search
            </button>
          </div>
        </div>

        {/* ════ Row 2 — Category pill rail (desktop only) ════ */}
        <nav className="dp-rail" aria-label="Category navigation">
          <div className="dp-rail__inner">
            <Link to={ROUTES.HOME} className={`dp-chip${isActive(ROUTES.HOME) ? ' dp-chip--active' : ''}`}>
              <Home className="w-3.5 h-3.5 shrink-0" /> Home
            </Link>
            {sortedCategories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`dp-chip dp-chip--cat${isCatActive(cat.slug) ? ' dp-chip--active' : ''}`}
              >
                {getCategoryIcon(cat.name, idx)} {cat.name}
              </Link>
            ))}
          </div>
        </nav>

      </header>

      {/* ════ Mobile drawer ════ */}
      {isMobileMenuOpen && (
        <>
          <div className="dp-mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
          <div className="dp-mobile-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">

            <div className="dp-mobile-panel__head">
              <Link to={ROUTES.HOME} className="dp-logo" onClick={() => setIsMobileMenuOpen(false)}>
                Define<span>Press</span>
              </Link>
              <button className="dp-icon-btn" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile inline search */}
            <div className="dp-mobile-search">
              <Search className="w-4 h-4 dp-mobile-search__icon" />
              <input
                type="text"
                className="dp-mobile-search__input"
                placeholder="Search…"
                onKeyDown={e => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value); }}
              />
            </div>

            {/* User strip or guest CTA */}
            {isAuthenticated && user ? (
              <div className="dp-mobile-user">
                <span className="dp-avatar dp-avatar--lg">{userInitial}</span>
                <div className="dp-mobile-user__info">
                  <p className="dp-mobile-user__name">{userDisplayName}</p>
                  <p className="dp-mobile-user__email">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="dp-mobile-guest">
                <Link to={ROUTES.REGISTER} className="dp-mobile-btn dp-mobile-btn--primary" onClick={() => setIsMobileMenuOpen(false)}>
                  <UserCircle2 className="w-4 h-4" /> Create Account
                </Link>
                <Link to={ROUTES.LOGIN} className="dp-mobile-btn dp-mobile-btn--ghost" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}

            {/* Nav links */}
            <nav className="dp-mobile-nav">
              <Link
                to={ROUTES.HOME}
                className={`dp-mobile-link${isActive(ROUTES.HOME) ? ' dp-mobile-link--active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 shrink-0" /> Home
              </Link>
              {sortedCategories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className={`dp-mobile-link${isCatActive(cat.slug) ? ' dp-mobile-link--active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getCategoryIcon(cat.name, idx)} {cat.name}
                </Link>
              ))}

              {isAuthenticated && user && (
                <div className="dp-mobile-auth-links">
                  {user.is_admin && (
                    <button className="dp-mobile-link" onClick={handleAdminDashboard}>
                      <LayoutDashboard className="w-4 h-4 shrink-0" /> Dashboard
                    </button>
                  )}
                  <button className="dp-mobile-link dp-mobile-link--danger" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                  </button>
                </div>
              )}
            </nav>

            <p className="dp-mobile-footer">© {new Date().getFullYear()} DefinePress</p>
          </div>
        </>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   Scoped dp- styles
───────────────────────────────────────────────────────────── */
const CSS = `
  :root {
    --dp-ink:          #111827;
    --dp-ink-soft:     #6b7280;
    --dp-accent:       #1d4ed8;
    --dp-accent-hover: #1e40af;
    --dp-surface:      #ffffff;
    --dp-border:       #e5e7eb;
    --dp-highlight:    #eff6ff;
    --dp-danger:       #dc2626;
    --dp-danger-bg:    #fef2f2;
    --dp-shadow:       0 1px 3px rgba(0,0,0,.10), 0 1px 2px rgba(0,0,0,.06);
    --dp-shadow-md:    0 4px 16px rgba(0,0,0,.10);
    --dp-radius:       6px;
    --dp-radius-full:  9999px;
    --dp-font-logo:    Georgia, 'Times New Roman', serif;
    --dp-font-ui:      system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --dp-topbar-h:     56px;
    --dp-rail-h:       46px;
    --dp-search-h:     52px;
  }

  /* ── Header ── */
  .dp-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--dp-border);
    box-shadow: var(--dp-shadow);
  }

  /* ── Top bar ── */
  .dp-topbar { height: var(--dp-topbar-h); }
  .dp-topbar__inner {
    max-width: 1280px; margin: 0 auto; padding: 0 1.25rem;
    height: 100%; display: flex; align-items: center;
    justify-content: space-between; gap: 12px;
  }

  /* ── Logo ── */
  .dp-logo {
    font-family: var(--dp-font-logo);
    font-size: 1.45rem; font-weight: 700;
    color: var(--dp-ink); text-decoration: none;
    letter-spacing: -.4px; white-space: nowrap; flex-shrink: 0; line-height: 1;
  }
  .dp-logo span { color: var(--dp-accent); }

  /* ── Actions ── */
  .dp-actions { display: flex; align-items: center; gap: 8px; }
  .dp-auth    { display: none; }
  @media (min-width: 640px) { .dp-auth { display: flex; align-items: center; } }

  /* ── Icon btn ── */
  .dp-icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px;
    border-radius: var(--dp-radius); border: none;
    background: transparent; color: var(--dp-ink-soft);
    cursor: pointer; transition: background .15s, color .15s; flex-shrink: 0;
  }
  .dp-icon-btn:hover,
  .dp-icon-btn--active { background: var(--dp-highlight); color: var(--dp-accent); }

  /* ── Account btn ── */
  .dp-account-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 34px;
    border-radius: var(--dp-radius-full);
    border: 1px solid var(--dp-border);
    background: var(--dp-surface); color: var(--dp-ink);
    font-family: var(--dp-font-ui); font-size: 0.82rem; font-weight: 600;
    text-decoration: none; transition: background .15s, border-color .15s;
    white-space: nowrap;
  }
  .dp-account-btn:hover { background: var(--dp-highlight); border-color: #bfdbfe; }

  /* ── User menu ── */
  .dp-user-menu { position: relative; }
  .dp-user-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 4px 10px 4px 4px;
    border-radius: var(--dp-radius-full);
    border: 1px solid var(--dp-border); background: transparent;
    color: var(--dp-ink); font-family: var(--dp-font-ui);
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    transition: background .15s;
  }
  .dp-user-btn:hover { background: var(--dp-highlight); }

  .dp-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--dp-highlight); color: var(--dp-accent);
    font-size: 0.75rem; font-weight: 700; font-family: var(--dp-font-ui);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .dp-avatar--lg { width: 38px; height: 38px; font-size: 1rem; }

  .dp-user-name { display: none; }
  @media (min-width: 1024px) {
    .dp-user-name { display: block; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
  .dp-chevron { color: var(--dp-ink-soft); flex-shrink: 0; }

  .dp-dropdown {
    position: absolute; right: 0; top: calc(100% + 6px);
    width: 215px; background: var(--dp-surface);
    border: 1px solid var(--dp-border); border-radius: 10px;
    box-shadow: var(--dp-shadow-md);
    opacity: 0; visibility: hidden; transform: translateY(-6px);
    transition: opacity .18s, transform .18s, visibility .18s;
    z-index: 200; overflow: hidden;
  }
  .dp-user-menu:hover .dp-dropdown,
  .dp-user-menu:focus-within .dp-dropdown {
    opacity: 1; visibility: visible; transform: translateY(0);
  }
  .dp-dropdown__header { padding: 10px 14px; border-bottom: 1px solid var(--dp-border); }
  .dp-dropdown__label {
    display: block; font-size: 0.7rem; font-family: var(--dp-font-ui);
    color: var(--dp-ink-soft); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px;
  }
  .dp-dropdown__email {
    display: block; font-size: 0.82rem; font-family: var(--dp-font-ui); font-weight: 600;
    color: var(--dp-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .dp-dropdown__item {
    display: flex; align-items: center; gap: 8px;
    width: 100%; padding: 9px 14px; border: none; background: none;
    font-family: var(--dp-font-ui); font-size: 0.83rem; color: var(--dp-ink);
    cursor: pointer; transition: background .12s; text-align: left;
  }
  .dp-dropdown__item:hover { background: var(--dp-highlight); }
  .dp-dropdown__item--danger { color: var(--dp-danger); }
  .dp-dropdown__item--danger:hover { background: var(--dp-danger-bg); }

  /* ── Hamburger ── */
  .dp-hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: var(--dp-radius);
    border: none; background: transparent; color: var(--dp-ink);
    cursor: pointer; transition: background .15s;
  }
  .dp-hamburger:hover { background: var(--dp-highlight); }
  @media (min-width: 768px) { .dp-hamburger { display: none; } }

  /* ── Search bar ── */
  .dp-searchbar {
    overflow: hidden; max-height: 0;
    background: #f8fafc;
    border-bottom: 0 solid var(--dp-border);
    transition: max-height .28s cubic-bezier(0.4,0,0.2,1), border-bottom-width .28s;
  }
  .dp-searchbar--open { max-height: var(--dp-search-h); border-bottom-width: 1px; }
  .dp-searchbar__inner {
    max-width: 860px; margin: 0 auto; padding: 0 1.25rem;
    height: var(--dp-search-h); display: flex; align-items: center; gap: 10px;
  }
  .dp-searchbar__icon { color: var(--dp-ink-soft); flex-shrink: 0; }
  .dp-searchbar__input {
    flex: 1; border: none; background: none;
    font-family: var(--dp-font-ui); font-size: 0.95rem;
    color: var(--dp-ink); outline: none;
  }
  .dp-searchbar__input::placeholder { color: var(--dp-ink-soft); }
  .dp-searchbar__submit {
    padding: 6px 18px; border-radius: var(--dp-radius-full);
    border: none; background: var(--dp-accent); color: #fff;
    font-family: var(--dp-font-ui); font-size: 0.82rem; font-weight: 600;
    cursor: pointer; white-space: nowrap; transition: background .15s;
  }
  .dp-searchbar__submit:hover { background: var(--dp-accent-hover); }

  /* ── Category pill rail (desktop only) ── */
  .dp-rail { display: none; background: var(--dp-surface); border-top: 1px solid var(--dp-border); }
  @media (min-width: 768px) { .dp-rail { display: block; } }
  .dp-rail--loading {
    display: flex !important; height: var(--dp-rail-h);
    align-items: center; padding: 0 1.25rem; gap: 8px; overflow: hidden;
  }
  .dp-rail__inner {
    max-width: 1280px; margin: 0 auto; padding: 0 1.25rem;
    height: var(--dp-rail-h); display: flex; align-items: center;
    gap: 6px; overflow-x: auto; scrollbar-width: none;
  }
  .dp-rail__inner::-webkit-scrollbar { display: none; }

  .dp-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: var(--dp-radius-full);
    background: #f3f4f6; border: 1px solid transparent;
    font-family: var(--dp-font-ui); font-size: 0.78rem; font-weight: 600;
    color: var(--dp-ink-soft); text-decoration: none; white-space: nowrap;
    transition: background .15s, color .15s, border-color .15s; flex-shrink: 0;
  }
  .dp-chip:hover { background: var(--dp-highlight); color: var(--dp-accent); }
  .dp-chip--active { background: var(--dp-highlight); color: var(--dp-accent); border-color: #bfdbfe; font-weight: 700; }
  .dp-chip--cat { text-transform: capitalize; font-weight: 500; }
  .dp-chip--cat.dp-chip--active { font-weight: 600; }

  /* ── Mobile drawer ── */
  .dp-mobile-backdrop {
    position: fixed; inset: 0; z-index: 110;
    background: rgba(0,0,0,.45); animation: dpFadeIn .2s ease;
  }
  .dp-mobile-panel {
    position: fixed; inset-y: 0; right: 0; z-index: 120;
    width: min(340px,92vw); background: var(--dp-surface);
    display: flex; flex-direction: column;
    animation: dpSlideIn .28s cubic-bezier(0.16,1,0.3,1); overflow-y: auto;
  }
  .dp-mobile-panel__head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1rem; height: 56px; border-bottom: 1px solid var(--dp-border); flex-shrink: 0;
  }

  .dp-mobile-search {
    display: flex; align-items: center; gap: 8px;
    margin: 12px 1rem; padding: 0 12px; height: 40px;
    background: #f3f4f6; border-radius: var(--dp-radius);
  }
  .dp-mobile-search__icon { color: var(--dp-ink-soft); flex-shrink: 0; }
  .dp-mobile-search__input {
    flex: 1; border: none; background: none;
    font-family: var(--dp-font-ui); font-size: 0.88rem; color: var(--dp-ink); outline: none;
  }
  .dp-mobile-search__input::placeholder { color: var(--dp-ink-soft); }

  .dp-mobile-user {
    display: flex; align-items: center; gap: 10px;
    margin: 0 1rem 8px; padding: 10px 12px;
    background: var(--dp-highlight); border-radius: var(--dp-radius);
  }
  .dp-mobile-user__info { min-width: 0; }
  .dp-mobile-user__name  { font-family: var(--dp-font-ui); font-size: 0.85rem; font-weight: 600; color: var(--dp-ink); margin: 0; }
  .dp-mobile-user__email { font-family: var(--dp-font-ui); font-size: 0.75rem; color: var(--dp-ink-soft); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .dp-mobile-guest {
    display: flex; flex-direction: column; gap: 8px; padding: 0 1rem 10px;
  }
  .dp-mobile-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 16px; border-radius: var(--dp-radius);
    font-family: var(--dp-font-ui); font-size: 0.88rem; font-weight: 600;
    text-decoration: none; text-align: center; transition: background .15s;
  }
  .dp-mobile-btn--primary { background: var(--dp-accent); color: #fff; border: none; }
  .dp-mobile-btn--primary:hover { background: var(--dp-accent-hover); }
  .dp-mobile-btn--ghost { background: none; border: 1px solid var(--dp-border); color: var(--dp-ink); }
  .dp-mobile-btn--ghost:hover { background: var(--dp-highlight); }

  .dp-mobile-nav {
    display: flex; flex-direction: column;
    padding: 8px 0.75rem 0; gap: 2px; flex: 1;
    border-top: 1px solid var(--dp-border);
  }
  .dp-mobile-link {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--dp-radius); font-family: var(--dp-font-ui);
    font-size: 0.88rem; font-weight: 500; color: var(--dp-ink);
    text-decoration: none; border: none; background: none; cursor: pointer;
    width: 100%; text-align: left; transition: background .12s, color .12s;
    text-transform: capitalize;
  }
  .dp-mobile-link:hover         { background: var(--dp-highlight); color: var(--dp-accent); }
  .dp-mobile-link--active       { background: var(--dp-highlight); color: var(--dp-accent); font-weight: 600; }
  .dp-mobile-link--danger       { color: var(--dp-danger); }
  .dp-mobile-link--danger:hover { background: var(--dp-danger-bg); color: var(--dp-danger); }

  .dp-mobile-auth-links {
    margin-top: 8px; padding-top: 8px;
    border-top: 1px solid var(--dp-border);
    display: flex; flex-direction: column; gap: 2px;
  }

  .dp-mobile-footer {
    text-align: center; font-family: var(--dp-font-ui); font-size: 0.72rem;
    color: var(--dp-ink-soft); padding: 12px;
    border-top: 1px solid var(--dp-border); margin: 0;
  }

  /* ── Skeletons ── */
  .dp-skeleton-row  { display: flex; gap: 12px; align-items: center; }
  .dp-skeleton-pill { height: 20px; width: 64px; border-radius: 4px; background: #e5e7eb; animation: dpPulse 1.5s ease-in-out infinite; }
  .dp-skeleton-chip { height: 28px; width: 72px; border-radius: 9999px; background: #e5e7eb; animation: dpPulse 1.5s ease-in-out infinite; flex-shrink: 0; }

  /* ── Keyframes ── */
  @keyframes dpFadeIn  { from { opacity: 0; }              to { opacity: 1; }            }
  @keyframes dpSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes dpPulse   { 0%, 100% { opacity: 1; } 50% { opacity: .4; }                  }
`;

export default Navbar;