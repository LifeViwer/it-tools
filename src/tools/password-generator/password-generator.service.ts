const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}:,.?/;',
} as const;

// Characters that are commonly confused when a password is read or typed.
const AMBIGUOUS_CHARACTERS = '0OoiIl1|S5sZ2zB8bG6g';

interface PasswordOptions {
  length?: number
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  excludeAmbiguous?: boolean
}

function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError('maxExclusive must be a positive integer');
  }

  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % maxExclusive;
}

function randomCharacter(charset: string): string {
  return charset[randomInt(charset.length)];
}

function shuffleSecurely(characters: string[]): void {
  for (let i = characters.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }
}

export function createPassword({
  length = 20,
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withSymbols = true,
  excludeAmbiguous = false,
}: PasswordOptions = {}): string {
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError('length must be a non-negative integer');
  }

  const selectedCharsets = [
    withUppercase ? CHARSETS.uppercase : '',
    withLowercase ? CHARSETS.lowercase : '',
    withNumbers ? CHARSETS.numbers : '',
    withSymbols ? CHARSETS.symbols : '',
  ]
    .map(charset => excludeAmbiguous
      ? [...charset].filter(character => !AMBIGUOUS_CHARACTERS.includes(character)).join('')
      : charset)
    .filter(Boolean);

  if (length < selectedCharsets.length) {
    throw new RangeError('length is too short for the selected character groups');
  }

  if (selectedCharsets.length === 0) {
    return '';
  }

  const allCharacters = selectedCharsets.join('');
  const password = selectedCharsets.map(randomCharacter);

  while (password.length < length) {
    password.push(randomCharacter(allCharacters));
  }

  shuffleSecurely(password);
  return password.join('');
}

export { AMBIGUOUS_CHARACTERS, CHARSETS };
