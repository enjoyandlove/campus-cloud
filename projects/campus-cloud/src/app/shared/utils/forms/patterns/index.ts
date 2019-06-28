/**
 * eg: d4d4d4
 */
export const hexColorString = /^[0-9A-F]{6}$/i;

export const validUrlRequiredProtocol = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/;

export const validUrlOptinalProtocol = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export const noSpecialCharacters = /[\-\[\]\/\\\{\}\(\)\*\+\?\.\^\$\|]/;

export const emailAddress = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
