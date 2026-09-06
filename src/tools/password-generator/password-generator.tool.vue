<script setup lang="ts">
import { createPasswords } from './password-generator.service';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';

const length = useQueryParam({ name: 'length', defaultValue: 20 });
const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSpaces = useQueryParam({ name: 'spaces', defaultValue: false });
const withSeparators = useQueryParam({ name: 'separators', defaultValue: true });
const withSpecial = useQueryParam({ name: 'special', defaultValue: true });
const excludeAmbiguous = useQueryParam({ name: 'excludeAmbiguous', defaultValue: false });
const count = useQueryParam({ name: 'count', defaultValue: 1 });
const { t } = useI18n();

const [passwords, refreshPasswords] = computedRefreshable(() =>
  createPasswords(count.value, {
    length: length.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: false,
    withSpaces: withSpaces.value,
    withSeparators: withSeparators.value,
    withSpecial: withSpecial.value,
    excludeAmbiguous: excludeAmbiguous.value,
  }),
);

const passwordText = computed(() => passwords.value.join('\n'));
const { copy } = useCopy({ source: passwordText, text: t('tools.password-generator.copied') });
const hasCharacterGroup = computed(() => withUppercase.value || withLowercase.value || withNumbers.value || withSpaces.value || withSeparators.value || withSpecial.value);
</script>

<template>
  <div>
    <c-card>
      <n-form label-placement="left" label-width="150">
        <div class="options-grid">
          <div>
            <n-form-item :label="t('tools.password-generator.uppercase')">
              <n-switch v-model:value="withUppercase" size="large" />
            </n-form-item>
            <div class="charset-preview">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            <n-form-item :label="t('tools.password-generator.lowercase')">
              <n-switch v-model:value="withLowercase" size="large" />
            </n-form-item>
            <div class="charset-preview">abcdefghijklmnopqrstuvwxyz</div>
            <n-form-item :label="t('tools.password-generator.numbers')">
              <n-switch v-model:value="withNumbers" size="large" />
            </n-form-item>
            <div class="charset-preview">0123456789</div>
          </div>
          <div>
            <n-form-item :label="t('tools.password-generator.spaces')">
              <n-switch v-model:value="withSpaces" size="large" />
            </n-form-item>
            <div class="charset-preview">{{ t('tools.password-generator.spacePreview') }}</div>
            <n-form-item :label="t('tools.password-generator.separators')">
              <n-switch v-model:value="withSeparators" size="large" />
            </n-form-item>
            <div class="charset-preview">-_</div>
            <n-form-item :label="t('tools.password-generator.special')">
              <n-switch v-model:value="withSpecial" size="large" />
            </n-form-item>
            <div class="charset-preview">~!@#$%^&amp;*()+</div>
          </div>
        </div>
      </n-form>

      <n-form-item :label="t('tools.password-generator.excludeAmbiguous')" label-placement="left">
        <n-switch v-model:value="excludeAmbiguous" size="large" class="ambiguous-switch" />
      </n-form-item>
      <div class="charset-preview">Il1oO0оОsS5</div>

      <n-form-item :label="`${t('tools.password-generator.length')} (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="4" :max="128" />
      </n-form-item>

      <c-input-text
        :value="passwordText"
        :placeholder="t('tools.password-generator.passwordPlaceholder')"
        readonly
        multiline
        :rows="Math.min(count, 6)"
        class="password-display"
      />

      <n-form-item :label="t('tools.password-generator.count')" label-placement="left">
        <n-input-number v-model:value="count" :min="1" :max="50" />
      </n-form-item>

      <div mt-5 flex justify-center gap-3>
        <c-button :disabled="!hasCharacterGroup" @click="copy()">
          {{ t('tools.password-generator.button.copy') }}
        </c-button>
        <c-button @click="refreshPasswords">
          {{ t('tools.password-generator.button.refresh') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.password-display) {
  textarea,
  input {
    font-family: monospace;
  }
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 2rem;
}

.charset-preview {
  margin: -0.5rem 0 0.75rem;
  color: var(--text-color-3);
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
}

@media (max-width: 640px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
