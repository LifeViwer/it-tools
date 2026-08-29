export type TransliterationScheme = 'icao_doc_9303' | 'gost_779_b' | 'yandex_maps';

interface Schema {
  mapping: Record<string, string>
  prevMapping?: Record<string, string>
  nextMapping?: Record<string, string>
  endingMapping?: Record<string, string>
}

const schemas: Record<TransliterationScheme, Schema> = {
  icao_doc_9303: {
    mapping: { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: 'ie', ы: 'y', ь: '', э: 'e', ю: 'iu', я: 'ia' },
  },
  gost_779_b: {
    mapping: { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'cz', ч: 'ch', ш: 'sh', щ: 'shh', ъ: '``', ы: 'y`', ь: '`', э: 'e`', ю: 'yu', я: 'ya' },
    nextMapping: { це: 'c', ци: 'c', цй: 'c', цы: 'c' },
  },
  yandex_maps: {
    mapping: { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' },
    prevMapping: { е: 'ye', ае: 'ye', ие: 'ye', ое: 'ye', уе: 'ye', эе: 'ye', юе: 'ye', яе: 'ye' },
    nextMapping: { ъе: 'y' },
    endingMapping: { ый: 'iy' },
  },
};

function cased(value: string, source: string): string {
  if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
  }
  return value;
}

function translateWord(word: string, schema: Schema): string {
  const ending = word.length > 2 ? word.slice(-2) : '';
  const endingValue = schema.endingMapping?.[ending.toLowerCase()];
  const limit = endingValue ? word.length - 2 : word.length;
  let result = '';
  for (let index = 0; index < limit; index++) {
    const current = word[index];
    const lowerCurrent = current.toLowerCase();
    const prev = index > 0 ? word[index - 1].toLowerCase() : '';
    const next = index + 1 < word.length ? word[index + 1].toLowerCase() : '';
    const mapped = schema.prevMapping?.[prev + lowerCurrent] ?? schema.nextMapping?.[lowerCurrent + next] ?? schema.mapping[lowerCurrent];
    result += mapped === undefined ? current : cased(mapped, current);
  }
  if (endingValue) {
    result += cased(endingValue, ending);
  }
  return result;
}

export function transliterate(source: string, scheme: TransliterationScheme): string {
  return source.replace(/[\p{L}\p{M}\p{N}_]+/gu, word => translateWord(word, schemas[scheme]));
}

export const transliterationSchemes: Array<{ label: string; value: TransliterationScheme }> = [
  { label: 'icao_doc_9303 — Загранпаспорт РФ', value: 'icao_doc_9303' },
  { label: 'gost_779_b — ГОСТ 7.79-2000, система Б', value: 'gost_779_b' },
  { label: 'yandex_maps — Веб / ЧПУ', value: 'yandex_maps' },
];
