function encode(input: string) {
  return btoa(unescape(encodeURIComponent(input)));
}

function decode(input: string) {
  return decodeURIComponent(escape(window.atob(input)));
}

export const base64 = {
  encode,
  decode
};
