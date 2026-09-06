<script setup lang="ts">
import { createPassphrases, createPasswords } from './password-generator.service';
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
const mode = useQueryParam({ name: 'mode', defaultValue: 'password' });
const wordCount = useQueryParam({ name: 'words', defaultValue: 4 });
const { t } = useI18n();

const isPassphrase = computed(() => mode.value === 'passphrase');
const [passwords, refreshPasswords] = computedRefreshable(() => isPassphrase.value
  ? createPassphrases(count.value, wordCount.value)
  : createPasswords(count.value, {
      length: length.value,
      withUppercase: withUppercase.value,
      withLowercase: withLowercase.value,
      withNumbers: withNumbers.value,
      withSymbols: false,
      withSpaces: withSpaces.value,
      withSeparators: withSeparators.value,
      withSpecial: withSpecial.value,
      excludeAmbiguous: excludeAmbiguous.value,
    }));

const passwordText = computed(() => passwords.value.join('\n'));
const { copy } = useCopy({ source: passwordText, text: t('tools.password-generator.copied') });
const hasCharacterGroup = computed(() => isPassphrase.value || withUppercase.value || withLowercase.value || withNumbers.value || withSpaces.value || withSeparators.value || withSpecial.value);
</script>

<template>
  <div>
    <c-card>
      <n-form class="generator-form" label-placement="left" label-width="150">
        <n-form-item :label="t('tools.password-generator.mode')">
          <n-radio-group v-model:value="mode">
            <n-radio value="password">{{ t('tools.password-generator.passwordMode') }}</n-radio>
            <n-radio value="passphrase">{{ t('tools.password-generator.passphraseMode') }}</n-radio>
          </n-radio-group>
        </n-form-item>

        <template v-if="!isPassphrase">
        <div class="section-title">{{ t('tools.password-generator.use') }}</div>
        <div class="options-grid">
          <div>
            <div class="option-row">
              <span class="option-label">{{ t('tools.password-generator.uppercaseWithChars') }}</span>
              <n-switch v-model:value="withUppercase" size="large" />
            </div>
            <div class="option-row">
              <span class="option-label">{{ t('tools.password-generator.lowercaseWithChars') }}</span>
              <n-switch v-model:value="withLowercase" size="large" />
            </div>
            <div class="option-row">
              <span class="option-label">{{ t('tools.password-generator.numbersWithChars') }}</span>
              <n-switch v-model:value="withNumbers" size="large" />
            </div>
          </div>
          <div>
            <div class="option-row">
              <span class="option-label">{{ t('tools.password-generator.spacesWithChars') }}</span>
              <n-switch v-model:value="withSpaces" size="large" />
            </div>
            <div class="option-row">
              <span class="option-label">{{ t('tools.password-generator.separatorsWithChars') }}</span>
              <n-switch v-model:value="withSeparators" size="large" />
            </div>
            <div class="option-row">
              <span class="option-label">{{ `${t('tools.password-generator.special')} (~!@#$%^&*()+)` }}</span>
              <n-switch v-model:value="withSpecial" size="large" />
            </div>
          </div>
        </div>
        </template>
        <template v-else>
          <n-form-item :label="t('tools.password-generator.wordCount')">
            <n-input-number v-model:value="wordCount" :min="3" :max="12" />
          </n-form-item>
          <div class="charset-preview">{{ t('tools.password-generator.passphrasePreview') }}</div>
        </template>
      </n-form>

      <div v-if="!isPassphrase" class="password-options">
      <div class="section-title">{{ t('tools.password-generator.doNotUse') }}</div>
      <div class="option-row">
        <span class="option-label">{{ t('tools.password-generator.excludeAmbiguousWithChars') }}</span>
        <n-switch v-model:value="excludeAmbiguous" size="large" class="ambiguous-switch" />
      </div>

      <n-form-item :label="`${t('tools.password-generator.length')} (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="4" :max="128" />
      </n-form-item>
      </div>

      <n-form-item :label="t('tools.password-generator.example')">
        <c-input-text
          :value="passwordText"
          :placeholder="t('tools.password-generator.passwordPlaceholder')"
          readonly
          multiline
          :rows="Math.min(count, 6)"
          class="password-display"
        />
      </n-form-item>

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

.section-title {
  margin: 1rem 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 2rem;
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
  margin-bottom: 0.85rem;
}

.option-label {
  min-width: 0;
  flex: 1;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.option-row :deep(.n-switch) {
  flex: 0 0 auto;
}

.charset-preview {
  margin: -0.5rem 0 0.75rem;
  color: var(--text-color-3);
  font-family: monospace;
  font-size: 0.85rem;
  word-break: break-all;
}

@media (max-width: 640px) {
  .generator-form {
    :deep(.n-form-item) {
      flex-direction: column;
      align-items: stretch;
    }

    :deep(.n-form-item-label) {
      width: auto !important;
      justify-content: flex-start;
      margin-bottom: 0.35rem;
    }

    :deep(.n-form-item-blank) {
      min-width: 0;
    }
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .password-display,
  .generator-form,
  .password-options {
    max-width: 100%;
  }

  .option-row {
    align-items: flex-start;
  }

  .option-row :deep(.n-switch) {
    margin-top: 0.1rem;
  }
}
</style>
