function encode(input: string) {
  return btoa(input);
}

function decode(input: string) {
  return atob(input);
}

export const base64 = {
  encode,
  decode
};
