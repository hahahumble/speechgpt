export function absolutifyLink(rel: string): string {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', rel);
  return anchor.href;
}
