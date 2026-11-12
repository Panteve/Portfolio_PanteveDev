import { Component, ElementRef, computed, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';
import { ABOUT_FILES, ABOUT_FOLDERS, AboutFile } from '../../data/about';
import { PROFILE } from '../../data/profile';
import { SNIPPETS } from '../../data/snippets';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { ExplorerIconComponent } from '../../shared/components/explorer-icon/explorer-icon.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SnippetCardComponent } from '../../shared/components/snippet-card/snippet-card.component';

const TREE_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowRight', 'ArrowLeft'];

/** Colores de carpeta al estilo de Material Icon Theme de VS Code. */
const FOLDER_COLORS: Record<string, string> = {
  bio: '#8bc34a',
  intereses: '#c586c0',
  educacion: '#42a5f5',
  experiencia: '#e37933',
  contacto: '#ef5350',
};

@Component({
  selector: 'app-sobre-mi',
  imports: [CodeBlockComponent, ExplorerIconComponent, IconComponent, SnippetCardComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sobre-mi.component.html',
})
export class SobreMiComponent {
  protected readonly folders = ABOUT_FOLDERS;
  protected readonly snippets = SNIPPETS;
  protected readonly profile = PROFILE;

  protected readonly selected = signal<AboutFile>(ABOUT_FILES[0]);
  protected readonly openFolders = signal<Set<string>>(
    new Set(ABOUT_FOLDERS.map((folder) => folder.id)),
  );

  protected readonly selectedFolderLabel = computed(
    () =>
      this.folders.find((folder) => folder.id === this.selected().folderId)?.label ?? 'src',
  );
  protected readonly lineCount = computed(() => this.selected().code.split('\n').length);

  private readonly editorPanel = viewChild<ElementRef<HTMLElement>>('editorPanel');

  constructor() {
    inject(SeoService).set(
      'Sobre mí · Diego',
      'Bio, educación, experiencia e intereses de Diego, estudiante de Ingeniería de Software en Bogotá.',
    );
  }

  protected selectFile(file: AboutFile): void {
    this.selected.set(file);
    this.openFolders.update((current) => {
      const next = new Set(current);
      next.add(file.folderId);
      return next;
    });

    if (window.matchMedia('(max-width: 1023px)').matches) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.editorPanel()?.nativeElement.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
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
      ? `${base} bg-accent/10 text-white ring-1 ring-inset ring-accent/20`
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
