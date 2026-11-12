export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'boolean'
  | 'keyword'
  | 'type'
  | 'decorator'
  | 'separator'
  | 'key';

export interface CodeToken {
  text: string;
  kind: TokenKind;
  braceLevel?: number;
}

export interface CodeLine {
  tokens: CodeToken[];
  indent: number;
}

export function tokenClass(token: CodeToken): string {
  return token.braceLevel !== undefined
    ? `tok-brace-${token.braceLevel % 3}`
    : `tok-${token.kind}`;
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

// Un solo patrón para comentarios, strings, decoradores, keywords, tipos, números y separadores.
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`/\*[\s\S]*?\*/`,
    String.raw`//[^\n]*`,
    String.raw`#[^\n]*`,
    String.raw`'(?:[^'\\\n]|\\.)*'`,
    String.raw`"(?:[^"\\\n]|\\.)*"`,
    String.raw`\`(?:[^\`\\]|\\.)*\``,
    String.raw`@[A-Za-z_]\w*`,
    String.raw`\b(?:true|false)\b`,
    String.raw`\b(?:${[...KEYWORDS].join('|')})\b`,
    String.raw`\b[A-Z][A-Za-z0-9_]*\b`,
    String.raw`\b\d+(?:\.\d+)?\b`,
    String.raw`[{}\[\]():,;=|&]`,
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
  if (token === 'true' || token === 'false') {
    return 'boolean';
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
  if (/^[{}\[\]():,;=|&]$/.test(token)) {
    return 'separator';
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

function assignBraceLevels(tokens: CodeToken[]): void {
  let depth = 0;

  for (const token of tokens) {
    if (token.kind !== 'separator') {
      continue;
    }

    if (token.text === '{') {
      token.braceLevel = depth % 3;
      depth += 1;
    } else if (token.text === '}') {
      depth = Math.max(0, depth - 1);
      token.braceLevel = depth % 3;
    }
  }
}

function nextSignificant(tokens: CodeToken[], index: number): CodeToken | undefined {
  for (let cursor = index + 1; cursor < tokens.length; cursor += 1) {
    if (tokens[cursor].text.trim().length > 0) {
      return tokens[cursor];
    }
  }

  return undefined;
}

function classifyKeys(tokens: CodeToken[]): void {
  tokens.forEach((token, index) => {
    const next = nextSignificant(tokens, index);

    if (!next || next.kind !== 'separator') {
      return;
    }

    if (next.text === ':' && (token.kind === 'string' || token.kind === 'plain')) {
      if (token.kind === 'string' || /^[A-Za-z_$][\w$]*$/.test(token.text)) {
        token.kind = 'key';
      }
      return;
    }

    if (
      next.text === '=' &&
      /^[A-Z][A-Z0-9_]*$/.test(token.text) &&
      (token.kind === 'plain' || token.kind === 'type')
    ) {
      token.kind = 'key';
    }
  });
}

function leadingIndent(tokens: CodeToken[]): number {
  const line = tokens.map((token) => token.text).join('');
  return line.match(/^[ \t]*/)?.[0].length ?? 0;
}

function stripIndent(tokens: CodeToken[], indent: number): CodeToken[] {
  if (indent === 0) {
    return tokens;
  }

  let remaining = indent;
  const result: CodeToken[] = [];

  for (const token of tokens) {
    if (remaining <= 0) {
      result.push(token);
      continue;
    }

    if (token.text.length <= remaining) {
      remaining -= token.text.length;
      continue;
    }

    result.push({ ...token, text: token.text.slice(remaining) });
    remaining = 0;
  }

  return result;
}

function toLines(tokens: CodeToken[]): CodeLine[] {
  const rawLines: CodeToken[][] = [[]];

  for (const token of tokens) {
    const parts = token.text.split('\n');

    parts.forEach((part, index) => {
      if (index > 0) {
        rawLines.push([]);
      }
      if (part.length > 0) {
        rawLines[rawLines.length - 1].push({ ...token, text: part });
      }
    });
  }

  return rawLines.map((lineTokens) => {
    const indent = leadingIndent(lineTokens);
    const stripped = stripIndent(lineTokens, indent);
    classifyKeys(stripped);

    return { tokens: stripped, indent };
  });
}

/**
 * Convierte código en líneas de tokens para pintarlo con <span class="tok-*">.
 * No es un parser: solo cubre lo que se usa en los archivos del portfolio.
 */
export function highlightCode(source: string): CodeLine[] {
  const tokens = tokenize(source);
  assignBraceLevels(tokens);
  return toLines(tokens);
}
