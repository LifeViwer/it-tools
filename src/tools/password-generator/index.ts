import { defineTool } from '../tool';
import PasswordIcon from '~icons/mdi/form-textbox-password';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.password-generator.title'),
  path: '/password-generator',
  description: translate('tools.password-generator.description'),
  keywords: ['password', 'generator', 'random', 'secure', 'crypto', 'cryptographic', 'uppercase', 'lowercase', 'numbers', 'symbols'],
  component: () => import('./password-generator.tool.vue'),
  icon: PasswordIcon,
});
