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
  root: string;
  envName: string;
  production: boolean;
  keys?: {
    [key: string]: string;
  };
}
