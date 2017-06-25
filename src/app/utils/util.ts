export function rtrim(char, str) {
  if (str.slice(str.length - char.length) === char) {
    return rtrim(char, str.slice(0, 0 - char.length));
  } else {
    return str;
  }
}
