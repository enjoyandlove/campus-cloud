interface IWildCard {
  ['*']: boolean;
}

interface IFeatureFlag {
  [key: string]: {
    active: boolean;
    internal?: boolean;
  };
}

type Flag = IFeatureFlag | IWildCard;

export interface IEnvironment {
  flags: Flag;
  root: string;
  envName: string;
  production: boolean;
}
