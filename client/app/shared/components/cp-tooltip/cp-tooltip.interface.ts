export interface IToolTipContent {
  content: string;
  trigger?: string; // hover, click, manual (default = manual)
  text: string;
  link?: {
    text: string;
    url: string;
  };
}
