export function absolutifyLink(rel: string): string {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', rel);
  return anchor.href;
}

export function getEnvironmentVariable(name: string): string {
  const environment_variable_name = 'VITE_' + name;
  return import.meta.env[environment_variable_name];
}

export function existEnvironmentVariable(name: string): boolean {
  const environment_variable_name = 'VITE_' + name;
  return import.meta.env[environment_variable_name] !== 'REPLACE_WITH_YOUR_OWN';
}
