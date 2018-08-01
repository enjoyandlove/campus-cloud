export enum PersonasType {
  mobile = 0,
  web = 1
}

export enum PersonasLoginRequired {
  optional = 0,
  forbidden = -1,
  required = 1
}

export enum PersonaValidationErrors {
  api_env = 'api_env',
  last_persona = 'last persona',
  users_associated = 'users associated',
  customization_off = 'customization off',
  persona_non_empty = 'persona non-empty'
}
