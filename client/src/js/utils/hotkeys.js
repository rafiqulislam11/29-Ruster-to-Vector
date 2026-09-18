/**
 * CreativeForge AI — Keyboard Shortcuts & Canvas Hotkeys System
 * Provides power-user keyboard controls for canvas zoom/pan, history undo/redo,
 * quick export, batch processing, and hotkey cheat sheet display.
 */

export class HotkeysManager {
  static initialized = false;

  static init({
    onUndo = () => {},
    onRedo = () => {},
    onZoomIn = () => {},
    onZoomOut = () => {},
    onZoomReset = () => {},
    onQuickExport = () => {},
    onToggleBatch = () => {},
    onShowShortcuts = () => {}
  }) {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener('keydown', (e) => {
      // Ignore hotkeys when typing in form inputs or textareas
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // ? or Shift+/ -> Open Shortcuts Cheat Sheet
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onShowShortcuts();
        return;
      }

      // Ctrl + Z -> Undo
      if (ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Ctrl + Y or Ctrl + Shift + Z -> Redo
      if ((ctrlKey && e.key.toLowerCase() === 'y') || (ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        onRedo();
        return;
      }

      // Ctrl + E -> Quick Export
      if (ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onQuickExport();
        return;
      }

      // Ctrl + B -> Toggle Batch Modal
      if (ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onToggleBatch();
        return;
      }

      // Zoom In: + or = or ]
      if ((e.key === '+' || e.key === '=' || e.key === ']') && !ctrlKey) {
        e.preventDefault();
        onZoomIn();
        return;
      }

      // Zoom Out: - or _ or [
      if ((e.key === '-' || e.key === '_' || e.key === '[') && !ctrlKey) {
        e.preventDefault();
        onZoomOut();
        return;
      }

      // Reset Zoom to Fit: 0
      if (e.key === '0' && !ctrlKey) {
        e.preventDefault();
        onZoomReset();
        return;
      }
    });

    // Spacebar Canvas Pan state tracking
    let isSpaceDown = false;
    window.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.code === 'Space' && !isSpaceDown) {
        isSpaceDown = true;
        document.body.classList.add('space-pan-active');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        isSpaceDown = false;
        document.body.classList.remove('space-pan-active');
      }
    });
  }

  /**
   * Renders the interactive Shortcuts Cheat Sheet Modal
   */
  static getShortcutsList() {
    return [
      { key: 'Space + Drag', desc: 'Pan canvas freely in any direction' },
      { key: 'Ctrl + Z', desc: 'Undo last creative adjustment' },
      { key: 'Ctrl + Y / Ctrl+Shift+Z', desc: 'Redo previously undone adjustment' },
      { key: 'Ctrl + E', desc: 'Quick 300 PPI Export dialog' },
      { key: 'Ctrl + B', desc: 'Open 500-Image Batch Processing Studio' },
      { key: '+  or  ]', desc: 'Zoom in on canvas (up to 800%)' },
      { key: '-  or  [', desc: 'Zoom out on canvas (down to 25%)' },
      { key: '0', desc: 'Reset zoom and fit canvas to viewport' },
      { key: '?', desc: 'Show this keyboard shortcuts cheat sheet' }
    ];
  }
}
