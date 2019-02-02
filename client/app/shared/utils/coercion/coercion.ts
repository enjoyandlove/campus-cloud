export function isBoolean(val: any) {
  return typeof val === 'boolean';
}

export function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}
