import { LetterT } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cyrillic-transliteration.title'),
  path: '/cyrillic-transliteration',
  description: translate('tools.cyrillic-transliteration.description'),
  keywords: ['cyrillic', 'transliteration', 'transliterate', 'iuliia', 'russian', 'icao', 'gost', 'yandex', 'passport', 'slug'],
  component: () => import('./cyrillic-transliteration.vue'),
  icon: LetterT,
});
