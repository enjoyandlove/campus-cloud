export enum PersonasType {
  mobile = 0,
  web = 1
}

export enum PersonasLoginRequired {
  optional = 0,
  forbidden = -1,
  required = 1
}

export enum TileCategoryRank {
  unordered = 0,
  hidden = -1
}

export enum TileFeatureRank {
  notFeatured = -1
}

export enum TileVisibility {
  visible = 1,
  invisible = -1
}

export enum PersonaValidationErrors {
  api_env = 'api_env',
  last_persona = 'last persona',
  users_associated = 'users associated',
  customization_off = 'customization off'
}
