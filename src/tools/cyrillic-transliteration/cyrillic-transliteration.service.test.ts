import { describe, expect, it } from 'vitest';
import { transliterate } from './cyrillic-transliteration.service';

describe('cyrillic transliteration', () => {
  const sample = 'Юлия, съешь ещё этих мягких французских булок из Йошкар-Олы, да выпей алтайского чаю';

  it('matches the iuliia ICAO DOC 9303 sample', () => {
    expect(transliterate(sample, 'icao_doc_9303')).toBe('Iuliia, sieesh eshche etikh miagkikh frantsuzskikh bulok iz Ioshkar-Oly, da vypei altaiskogo chaiu');
  });

  it('matches the iuliia GOST 7.79 system B sample', () => {
    expect(transliterate(sample, 'gost_779_b')).toBe('Ûliâ, sʺešʹ eŝё ètih mâgkih francuzskih bulok iz Joškar-Oly, da vypej altajskogo čaû');
  });

  it('matches the iuliia Yandex Maps sample', () => {
    expect(transliterate(sample, 'yandex_maps')).toBe('Yuliya, syesh yeschyo etikh myagkikh frantsuzskikh bulok iz Yoshkar-Oly, da vypey altayskogo chayu');
  });

  it('preserves non-Cyrillic text and punctuation', () => {
    expect(transliterate('Hello, Москва! 123', 'yandex_maps')).toBe('Hello, Moskva! 123');
  });
});
