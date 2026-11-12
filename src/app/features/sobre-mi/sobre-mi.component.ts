import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import {
  ABOUT_FILES,
  ABOUT_FOLDERS,
  ABOUT_ROOT_FILES,
  AboutFile,
  AboutViewMode,
} from '../../data/about';
import { PROJECTS } from '../../data/projects';
import { EDUCATION, EXPERIENCE, INTERESTS, PROFILE } from '../../data/profile';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { CodeMinimapComponent } from '../../shared/components/code-minimap/code-minimap.component';
import { ContactCardComponent } from '../../shared/components/contact-card/contact-card.component';
import { ExplorerIconComponent } from '../../shared/components/explorer-icon/explorer-icon.component';
import { TerminalPanelComponent } from '../../shared/components/terminal-panel/terminal-panel.component';
import type { TerminalLine } from '../../shared/components/terminal-panel/terminal-panel.component';

const TREE_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowRight', 'ArrowLeft'];

/** Colores de carpeta al estilo de Material Icon Theme de VS Code. */
const FOLDER_COLORS: Record<string, string> = {
  bio: '#8bc34a',
  intereses: '#c586c0',
  educacion: '#42a5f5',
  experiencia: '#e37933',
};

@Component({
  selector: 'app-sobre-mi',
  host: { class: 'flex min-h-0 flex-col lg:h-[calc(100dvh-5.625rem)] lg:flex-none' },
  imports: [
    CodeBlockComponent,
    CodeMinimapComponent,
    ContactCardComponent,
    ExplorerIconComponent,
    TerminalPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sobre-mi.component.html',
})
export class SobreMiComponent {
  protected readonly folders = ABOUT_FOLDERS;
  protected readonly rootFiles = ABOUT_ROOT_FILES;

  protected readonly selected = signal<AboutFile>(ABOUT_FILES[0]);
  protected readonly openTabs = signal<AboutFile[]>([...ABOUT_FILES]);
  protected readonly openFolders = signal<Set<string>>(
    new Set(ABOUT_FOLDERS.map((folder) => folder.id)),
  );
  protected readonly viewMode = signal<AboutViewMode>(ABOUT_FILES[0].defaultMode);

  private readonly modifiedFiles = new Set<string>(['intereses']);
  private readonly viewModes = new Map<string, AboutViewMode>();

  protected readonly selectedFolderLabel = computed(() => {
    const file = this.selected();

    if (!file.folderId) {
      return '';
    }

    return this.folders.find((folder) => folder.id === file.folderId)?.label ?? 'src';
  });
  protected readonly lineCount = computed(() => this.selected().code.split('\n').length);
  protected readonly displayedCode = signal('');
  protected readonly activeLine = signal(0);

  protected readonly terminalLines: TerminalLine[] = [
    { text: 'npm run portfolio', tone: 'command' },
    { text: '' },
    { text: '> portfolio@0.0.0 portfolio', tone: 'muted' },
    { text: '> node scripts/portfolio.mjs', tone: 'muted' },
    { text: '' },
    { text: '▸ README.md        perfil y presentación', tone: 'info' },
    { text: `▸ bio.ts           ${PROFILE.firstName} · ${PROFILE.city}`, tone: 'info' },
    { text: `▸ intereses.env    ${INTERESTS.length} intereses`, tone: 'info' },
    { text: `▸ educacion.json   ${EDUCATION[0]?.subtitle ?? 'Ingeniería de Software'}`, tone: 'info' },
    { text: `▸ experiencia.log  ${EXPERIENCE.length} experiencias`, tone: 'info' },
    { text: `▸ proyectos        ${PROJECTS.length} casos de estudio`, tone: 'info' },
    { text: '' },
    { text: `✔ ${ABOUT_FILES.length} archivos compilados sin errores`, tone: 'success' },
    { text: '→ http://localhost:4200', tone: 'link' },
  ];

  private readonly typedFiles = new Set<string>();
  private typingFrame?: number;
  private typing = false;

  private readonly editorPanel = viewChild<ElementRef<HTMLElement>>('editorPanel');

  constructor() {
    inject(SeoService).set(
      'Sobre mí · Diego',
      'Bio, educación, experiencia e intereses de Diego, estudiante de Ingeniería de Software en Bogotá.',
    );

    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.cancelTyping());

    afterNextRender(() => {
      const file = this.selected();
      this.viewMode.set(this.modeFor(file));

      if (this.viewMode() === 'code') {
        this.startTyping(file);
      }
    });
  }

  protected selectFile(file: AboutFile): void {
    this.openTabs.update((tabs) =>
      tabs.some((tab) => tab.id === file.id) ? tabs : [...tabs, file],
    );
    this.openFolders.update((current) => {
      const next = new Set(current);

      if (file.folderId) {
        next.add(file.folderId);
      }

      return next;
    });

    this.activateFile(file);

    if (window.matchMedia('(max-width: 1023px)').matches) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.editorPanel()?.nativeElement.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }

  protected selectTab(file: AboutFile): void {
    this.activateFile(file);
  }

  private activateFile(file: AboutFile): void {
    if (this.selected().id === file.id) {
      return;
    }

    this.completeTyping();
    this.selected.set(file);

    const mode = this.modeFor(file);
    this.viewMode.set(mode);

    if (mode === 'view') {
      this.activeLine.set(0);
      this.displayedCode.set(this.typedFiles.has(file.id) ? file.code : '');
      return;
    }

    if (this.typedFiles.has(file.id)) {
      this.displayedCode.set(file.code);
      this.activeLine.set(0);
      return;
    }

    this.startTyping(file);
  }

  protected setView(mode: AboutViewMode): void {
    if (this.viewMode() === mode) {
      return;
    }

    const file = this.selected();
    this.viewModes.set(file.id, mode);

    if (mode === 'view') {
      this.completeTyping();
      this.viewMode.set('view');
      this.activeLine.set(0);
      return;
    }

    this.viewMode.set('code');

    if (this.typedFiles.has(file.id)) {
      this.displayedCode.set(file.code);
      this.activeLine.set(0);
      return;
    }

    this.startTyping(file);
  }

  protected viewButtonClass(mode: AboutViewMode): string {
    const base = 'rounded px-2 py-0.5 text-[10px] transition-colors duration-150';

    return this.viewMode() === mode
      ? `${base} bg-accent/10 text-accent ring-1 ring-inset ring-accent/20`
      : `${base} text-muted hover:text-ink`;
  }

  private modeFor(file: AboutFile): AboutViewMode {
    return this.viewModes.get(file.id) ?? file.defaultMode;
  }

  private startTyping(file: AboutFile): void {
    if (file.id !== this.selected().id || this.typedFiles.has(file.id)) {
      return;
    }

    this.cancelTyping();
    this.typing = true;
    this.activeLine.set(0);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.displayedCode.set(file.code);
      this.typedFiles.add(file.id);
      this.activeLine.set(this.lineIndex(file.code));
      this.typing = false;
      return;
    }

    const code = file.code;
    const start = performance.now();
    this.displayedCode.set('');

    const frame = (now: number): void => {
      if (!this.typing) {
        return;
      }

      const chars = Math.max(1, Math.floor((now - start) / 4));

      if (chars >= code.length) {
        this.displayedCode.set(code);
        this.typedFiles.add(file.id);
        this.activeLine.set(this.lineIndex(code));
        this.typing = false;
        this.typingFrame = undefined;
        return;
      }

      const partial = code.slice(0, chars);
      this.displayedCode.set(partial);
      this.activeLine.set(this.lineIndex(partial));
      this.typingFrame = requestAnimationFrame(frame);
    };

    this.typingFrame = requestAnimationFrame(frame);
  }

  private completeTyping(): void {
    if (!this.typing) {
      return;
    }

    const file = this.selected();
    this.displayedCode.set(file.code);
    this.typedFiles.add(file.id);
    this.activeLine.set(this.lineIndex(file.code));
    this.cancelTyping();
  }

  private lineIndex(code: string): number {
    return code.split('\n').length - 1;
  }

  private cancelTyping(): void {
    this.typing = false;

    if (this.typingFrame !== undefined) {
      cancelAnimationFrame(this.typingFrame);
      this.typingFrame = undefined;
    }
  }

  protected isModified(file: AboutFile): boolean {
    return this.modifiedFiles.has(file.id);
  }

  protected tabClass(file: AboutFile): string {
    const base =
      'flex shrink-0 items-center gap-1.5 rounded-t border border-b-0 px-3 py-1.5 text-[11px] transition-colors duration-150';

    return this.selected().id === file.id
      ? `${base} border-line bg-surface text-white ring-1 ring-inset ring-accent/25 shadow-[0_0_22px_-10px_rgba(45,212,191,0.55)]`
      : `${base} border-transparent text-muted hover:bg-white/5 hover:text-ink`;
  }

  protected toggleFolder(folderId: string): void {
    this.openFolders.update((current) => {
      const next = new Set(current);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }

  protected isOpen(folderId: string): boolean {
    return this.openFolders().has(folderId);
  }

  protected folderColor(folderId: string): string {
    return FOLDER_COLORS[folderId] ?? '#8a9ab5';
  }

  protected fileClass(file: AboutFile): string {
    const base =
      'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] transition-colors duration-150';

    return this.selected().id === file.id
      ? `${base} bg-accent/10 text-white ring-1 ring-inset ring-accent/30 shadow-[0_0_18px_-8px_rgba(45,212,191,0.5)]`
      : `${base} text-muted hover:bg-white/5 hover:text-ink`;
  }

  protected onTreeKeydown(event: KeyboardEvent): void {
    if (!TREE_KEYS.includes(event.key)) {
      return;
    }

    const tree = event.currentTarget as HTMLElement;
    const items = Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const active = document.activeElement as HTMLElement | null;
    const currentIndex = active ? items.indexOf(active) : -1;

    if (currentIndex === -1) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      items[(currentIndex + delta + items.length) % items.length]?.focus();
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      items[event.key === 'Home' ? 0 : items.length - 1]?.focus();
      return;
    }

    const folderId = active?.dataset['folder'];
    if (!folderId) {
      return;
    }

    event.preventDefault();
    if (event.key === 'ArrowRight' && !this.isOpen(folderId)) {
      this.toggleFolder(folderId);
    }
    if (event.key === 'ArrowLeft' && this.isOpen(folderId)) {
      this.toggleFolder(folderId);
    }
  }
}
