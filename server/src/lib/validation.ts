// Mirrored in web/src/lib/validation.ts.
export const PLAYERTAG_PATTERN = /^[A-Za-z0-9æøåÆØÅ!@$#%&,._-]{2,16}$/;
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;
export const MAX_PLAYERS_PER_REGISTRATION = 5;
export const MAX_CHAT_MESSAGE_LENGTH = 256;
export const MAX_DESCRIPTION_LENGTH = 500;

export const isValidPlayertag = (value: string) => PLAYERTAG_PATTERN.test(value);
export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value) && value.length <= 254;
export const isValidPassword = (value: string) =>
  value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
