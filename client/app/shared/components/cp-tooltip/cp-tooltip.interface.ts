export interface IToolTipContent {
  content: string;
  trigger?: string; // hover, click, manual (default = manual)
  text: string;
  textClass?: string;
  icon: string;
  link?: {
    text: string;
    url: string;
  };
}
