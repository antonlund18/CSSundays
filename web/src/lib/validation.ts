// Mirrors public.is_valid_playertag() in the database.
export const PLAYERTAG_PATTERN = /^[A-Za-z0-9æøåÆØÅ!@$#%&,._-]{2,16}$/;
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_REQUIREMENTS = `Dit kodeord skal være mellem ${PASSWORD_MIN_LENGTH} og ${PASSWORD_MAX_LENGTH} tegn.`;
export const PLAYERTAG_REQUIREMENTS = "2–16 tegn: bogstaver, tal og !@$#%&,._-";

export const isValidPlayertag = (value: string) => PLAYERTAG_PATTERN.test(value);
export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value);
export const isValidPassword = (value: string) =>
  value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
export const isValidTeamName = (value: string) => value.trim().length >= 2 && value.trim().length <= 32;
