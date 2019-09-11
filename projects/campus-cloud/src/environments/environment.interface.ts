interface IWildCard {
  ['*']: boolean;
}

interface IFeatureFlag {
  [key: string]: {
    whitelist: number[];
  };
}

type Flag = IFeatureFlag | IWildCard;

export interface IEnvironment {
  flags: Flag;
  version: string;
  root: string;
  production: boolean;
  keys?: {
    [key: string]: string;
  };
}
