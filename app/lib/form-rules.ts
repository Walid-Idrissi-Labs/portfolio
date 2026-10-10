// One copy of the form rules. The forms apply them in the browser and the API
// routes apply them again, because nothing forces a caller to use the forms.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_LIMIT = 100;
export const EMAIL_LIMIT = 254;
export const MESSAGE_LIMIT = 1000;
