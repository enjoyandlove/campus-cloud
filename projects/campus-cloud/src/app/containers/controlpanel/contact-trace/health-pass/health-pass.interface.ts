export enum EState {
  green = 1,
  yellow,
  red,
  no
}
export default interface IHealthPass {
  name: string;
  title: string;
  description: string;
  image_url: string;
  state: EState;
  icon: string;
}
