export enum BlockType {
  no_input = 0,
  multiple_choice = 1,
  multiple_selection = 2,
  text = 3,
  decimal = 4,
  image = 5,
  number = 6,
  yes_no = 10001 // This is a mock value and is only used by the UI. The API does not support this value.
}
