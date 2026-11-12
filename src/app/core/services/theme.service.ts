import { isPlatformBrowser } from '@angular/common';
import {
  DOCUMENT,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';
const THEME_COLORS: Record<Theme, string> = {
  light: '#e1e2e7',
  dark: '#1a1b26',
};

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly mediaQuery = this.isBrowser
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  private readonly storedTheme = this.readStoredTheme();
  private readonly manualChoice = signal(this.storedTheme !== null);
  private readonly themeState = signal<Theme>(this.resolveInitialTheme());
  private transitionTimeout: number | undefined;

  readonly theme = this.themeState.asReadonly();
  readonly isDark = computed(() => this.themeState() === 'dark');

  constructor() {
    this.applyTheme(this.themeState(), false);

    if (this.isBrowser && this.mediaQuery) {
      this.mediaQuery.addEventListener('change', this.onSystemThemeChange);
    }
  }

  ngOnDestroy(): void {
    this.mediaQuery?.removeEventListener('change', this.onSystemThemeChange);

    if (this.transitionTimeout !== undefined) {
      window.clearTimeout(this.transitionTimeout);
    }
  }

  toggle(): void {
    this.manualChoice.set(true);
    this.setTheme(this.isDark() ? 'light' : 'dark', true);
  }

  private setTheme(theme: Theme, animate: boolean): void {
    this.themeState.set(theme);
    this.applyTheme(theme, animate);
    this.persistTheme(theme);
  }

  private applyTheme(theme: Theme, animate: boolean): void {
    const root = this.document.documentElement;

    if (animate && this.isBrowser) {
      this.startThemeTransition(root);
    }

    root.dataset['theme'] = theme;
    root.style.colorScheme = theme;

    const themeColor = this.document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    themeColor?.setAttribute('content', THEME_COLORS[theme]);
  }

  private startThemeTransition(root: HTMLElement): void {
    root.classList.add('theme-transition');

    if (this.transitionTimeout !== undefined) {
      window.clearTimeout(this.transitionTimeout);
    }

    this.transitionTimeout = window.setTimeout(() => {
      root.classList.remove('theme-transition');
      this.transitionTimeout = undefined;
    }, 180);
  }

  private readonly onSystemThemeChange = (event: MediaQueryListEvent): void => {
    if (this.manualChoice()) {
      return;
    }

    const theme: Theme = event.matches ? 'dark' : 'light';
    this.themeState.set(theme);
    this.applyTheme(theme, true);
  };

  private resolveInitialTheme(): Theme {
    const initialTheme = this.document.documentElement.dataset['theme'];

    if (initialTheme === 'light' || initialTheme === 'dark') {
      return initialTheme;
    }

    if (this.storedTheme) {
      return this.storedTheme;
    }

    return this.mediaQuery?.matches ? 'dark' : 'light';
  }

  private readStoredTheme(): Theme | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }

  private persistTheme(theme: Theme): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // El navegador puede bloquear el almacenamiento; el tema sigue activo en la sesión.
    }
  }
}
