const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  spaces: ' ',
  separators: '-_',
  special: '~!@#$%^&*()+',
  symbols: '~!@#$%^&*()-_=+',
} as const;

// Characters that are commonly confused when a password is read or typed.
const AMBIGUOUS_CHARACTERS = '0OoiIl1|S5sZ2zB8bG6gоО';

const PASSPHRASE_WORDS = [
  'amber', 'anchor', 'apple', 'arrow', 'autumn', 'badge', 'bamboo', 'beacon',
  'berry', 'birch', 'blanket', 'blossom', 'breeze', 'bridge', 'cactus', 'candle',
  'canyon', 'castle', 'cedar', 'cello', 'cinder', 'circle', 'cobalt', 'comet',
  'coral', 'cosmos', 'crystal', 'daisy', 'dawn', 'delta', 'desert', 'dolphin',
  'dream', 'drift', 'eagle', 'echo', 'ember', 'falcon', 'fern', 'flame',
  'forest', 'fox', 'garden', 'glacier', 'globe', 'golden', 'grape', 'harbor',
  'hazel', 'honey', 'horizon', 'island', 'jasmine', 'jungle', 'kite', 'kiwi',
  'lantern', 'lilac', 'lunar', 'maple', 'marble', 'meadow', 'melon', 'meteor',
  'mist', 'moon', 'morning', 'mountain', 'nectar', 'night', 'ocean', 'olive',
  'orange', 'orchid', 'otter', 'panda', 'pebble', 'pepper', 'phoenix', 'piano',
  'planet', 'plum', 'pocket', 'polar', 'prairie', 'pumpkin', 'quartz', 'rabbit',
  'rain', 'raven', 'reef', 'river', 'robin', 'rocket', 'rose', 'saffron',
  'sailor', 'salmon', 'shadow', 'silver', 'sky', 'snow', 'solstice', 'spark',
  'spring', 'star', 'stone', 'storm', 'summer', 'sunset', 'thunder', 'tiger',
  'topaz', 'tower', 'valley', 'velvet', 'violet', 'walnut', 'water', 'willow',
  'winter', 'wolf', 'wonder', 'xenon', 'yellow', 'zephyr',
] as const;

interface PasswordOptions {
  length?: number
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withSymbols?: boolean
  withSpaces?: boolean
  withSeparators?: boolean
  withSpecial?: boolean
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
  withSpaces = false,
  withSeparators = false,
  withSpecial = false,
  excludeAmbiguous = false,
}: PasswordOptions = {}): string {
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError('length must be a non-negative integer');
  }

  const selectedCharsets = [
    withUppercase ? CHARSETS.uppercase : '',
    withLowercase ? CHARSETS.lowercase : '',
    withNumbers ? CHARSETS.numbers : '',
    withSymbols === undefined
      ? ''
      : withSymbols
        ? CHARSETS.symbols
        : '',
    withSpaces ? CHARSETS.spaces : '',
    withSeparators ? CHARSETS.separators : '',
    withSpecial ? CHARSETS.special : '',
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

export function createPasswords(count: number, options: PasswordOptions = {}): string[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }

  return Array.from({ length: count }, () => createPassword(options));
}

export function createPassphrase(wordCount = 4, separator = '-'): string {
  if (!Number.isInteger(wordCount) || wordCount < 1) {
    throw new RangeError('wordCount must be a positive integer');
  }

  if (typeof separator !== 'string') {
    throw new TypeError('separator must be a string');
  }

  return Array.from({ length: wordCount }, () => PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)]).join(separator);
}

export function createPassphrases(count: number, wordCount = 4, separator = '-'): string[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }

  return Array.from({ length: count }, () => createPassphrase(wordCount, separator));
}

export { AMBIGUOUS_CHARACTERS, CHARSETS, PASSPHRASE_WORDS };
