export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'type'
  | 'decorator';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'export',
  'default',
  'interface',
  'type',
  'function',
  'return',
  'await',
  'async',
  'import',
  'from',
  'new',
  'class',
  'implements',
  'extends',
  'if',
  'else',
  'for',
  'of',
  'in',
  'while',
  'switch',
  'case',
  'break',
  'continue',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'readonly',
  'public',
  'private',
  'protected',
  'static',
  'this',
  'as',
  'satisfies',
  'func',
]);

// Un solo patrón para comentarios, strings, decoradores, keywords, tipos y números.
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`/\*[\s\S]*?\*/`,
    String.raw`//[^\n]*`,
    String.raw`#[^\n]*`,
    String.raw`'(?:[^'\\\n]|\\.)*'`,
    String.raw`"(?:[^"\\\n]|\\.)*"`,
    String.raw`\`(?:[^\`\\]|\\.)*\``,
    String.raw`@[A-Za-z_]\w*`,
    String.raw`\b(?:${[...KEYWORDS].join('|')})\b`,
    String.raw`\b[A-Z][A-Za-z0-9_]*\b`,
    String.raw`\b\d+(?:\.\d+)?\b`,
  ].join('|'),
  'g',
);

function classify(token: string): TokenKind {
  if (token.startsWith('//') || token.startsWith('/*') || token.startsWith('#')) {
    return 'comment';
  }
  if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
    return 'string';
  }
  if (token.startsWith('@')) {
    return 'decorator';
  }
  if (/^\d/.test(token)) {
    return 'number';
  }
  if (KEYWORDS.has(token)) {
    return 'keyword';
  }
  if (/^[A-Z]/.test(token)) {
    return 'type';
  }
  return 'plain';
}

function tokenize(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    const text = match[0];

    if (start > lastIndex) {
      tokens.push({ text: source.slice(lastIndex, start), kind: 'plain' });
    }

    tokens.push({ text, kind: classify(text) });
    lastIndex = start + text.length;
  }

  if (lastIndex < source.length) {
    tokens.push({ text: source.slice(lastIndex), kind: 'plain' });
  }

  return tokens;
}

/**
 * Convierte código en líneas de tokens para pintarlo con <span class="tok-*">.
 * No es un parser: solo cubre lo que se usa en los fragmentos del portfolio.
 */
export function highlightCode(source: string): CodeToken[][] {
  const lines: CodeToken[][] = [[]];

  for (const token of tokenize(source)) {
    const parts = token.text.split('\n');

    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }
      if (part.length > 0) {
        lines[lines.length - 1].push({ text: part, kind: token.kind });
      }
    });
  }

  return lines;
}
