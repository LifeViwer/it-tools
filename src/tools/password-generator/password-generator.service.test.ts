import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPassphrase, createPassphrases, createPassword, createPasswords } from './password-generator.service';

describe('password-generator', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      getRandomValues: vi.fn((values: Uint32Array) => {
        values[0] = Math.floor(Math.random() * 0x1_0000_0000);
        return values;
      }),
    });
  });

  it('creates a password with the requested length', () => {
    expect(createPassword({ length: 32 })).toHaveLength(32);
  });

  it('includes every selected character group', () => {
    const password = createPassword({ length: 64 });

    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}:,.?\/;]/);
  });

  it('does not include disabled character groups', () => {
    const password = createPassword({
      length: 64,
      withUppercase: false,
      withLowercase: false,
      withNumbers: true,
      withSymbols: false,
    });

    expect(password).toMatch(/^[0-9]+$/);
  });

  it('excludes visually ambiguous characters when requested', () => {
    const password = createPassword({ length: 256, excludeAmbiguous: true });

    expect(password).not.toMatch(/[0OoiIl1|S5sZ2zB8bG6g]/);
  });

  it('returns an empty string when all groups are disabled', () => {
    expect(createPassword({
      length: 20,
      withUppercase: false,
      withLowercase: false,
      withNumbers: false,
      withSymbols: false,
    })).toBe('');
  });

  it('rejects a length shorter than the selected groups', () => {
    expect(() => createPassword({ length: 3 })).toThrow(RangeError);
  });

  it('rejects invalid lengths with the documented errors', () => {
    expect(() => createPassword({ length: -1 })).toThrow(new RangeError('length must be a non-negative integer'));
    expect(() => createPassword({ length: 1 })).toThrow(new RangeError('length is too short for the selected character groups'));
    expect(() => createPassword({ length: 1.5 })).toThrow(new RangeError('length must be a non-negative integer'));
  });

  it('uses the Web Crypto API', () => {
    createPassword({ length: 20 });
    expect(crypto.getRandomValues).toHaveBeenCalled();
  });

  it('supports separate spaces, separators, and special character groups', () => {
    const password = createPassword({
      length: 32,
      withUppercase: false,
      withLowercase: false,
      withNumbers: false,
      withSymbols: false,
      withSpaces: true,
      withSeparators: true,
      withSpecial: true,
    });

    expect(password).toMatch(/[ ]/);
    expect(password).toMatch(/[-_]/);
    expect(password).toMatch(/[~!@#$%^&*()+]/);
  });

  it('creates the requested number of passwords', () => {
    expect(createPasswords(3, { length: 12 })).toHaveLength(3);
    expect(createPasswords(3, { length: 12 }).every(password => password.length === 12)).toBe(true);
  });

  it('creates a passphrase with the requested number of words', () => {
    const passphrase = createPassphrase(5, '-');

    expect(passphrase.split('-')).toHaveLength(5);
    expect(passphrase).toMatch(/^[a-z]+(?:-[a-z]+){4}$/);
  });

  it('creates the requested number of passphrases', () => {
    expect(createPassphrases(3, 4, ' ')).toHaveLength(3);
    expect(createPassphrases(3, 4, ' ').every(passphrase => passphrase.split(' ').length === 4)).toBe(true);
  });

  it('rejects invalid passphrase options', () => {
    expect(() => createPassphrase(0)).toThrow(new RangeError('wordCount must be a positive integer'));
    expect(() => createPassphrase(2, null as unknown as string)).toThrow(new TypeError('separator must be a string'));
  });
});
