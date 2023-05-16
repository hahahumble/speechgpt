export function absolutifyLink(rel: string): string {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', rel);
  return anchor.href;
}

export function getEnvironmentKey(name: string): string {
  return 'VITE_' + name;
}

export function getEnvironmentVariable(name: string, backup: string): string {
  const environment_variable_name = getEnvironmentKey(name);
  return existEnvironmentVariable(name) ? import.meta.env[environment_variable_name] : backup;
}

export function existEnvironmentVariable(name: string): boolean {
  const environment_variable_name = getEnvironmentKey(name);
  return import.meta.env[environment_variable_name] !== 'REPLACE_WITH_YOUR_OWN' &&
    import.meta.env[environment_variable_name] !== undefined;
}

export function getFormatDateTime(isoDateTime: string): any {
  const date = new Date(isoDateTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}
