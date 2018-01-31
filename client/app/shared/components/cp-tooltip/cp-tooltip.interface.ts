export interface IToolTipContent {
  content: string;
  trigger?: string; // hover, click, manual (default = manual)
  link?: {
    text: string;
    url: string;
  };
}