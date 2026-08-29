<script setup lang="ts">
import { type TransliterationScheme, transliterate, transliterationSchemes } from './cyrillic-transliteration.service';
import { useCopy } from '@/composable/copy';

const input = ref('');
const scheme = ref<TransliterationScheme>('icao_doc_9303');
const output = computed(() => transliterate(input.value, scheme.value));
const { copy } = useCopy({ source: output, text: 'Транслитерация скопирована в буфер обмена' });
</script>

<template>
  <c-card>
    <n-form-item label="Схема транслитерации" label-placement="left">
      <n-select v-model:value="scheme" :options="transliterationSchemes" />
    </n-form-item>

    <c-input-text
      v-model:value="input"
      multiline
      autosize
      autofocus
      raw-text
      label="Исходный текст"
      placeholder="Введите текст на кириллице..."
      test-id="cyrillic-transliteration-input"
    />

    <c-input-text
      :value="output"
      multiline
      readonly
      raw-text
      label="Результат"
      placeholder="Здесь появится транслитерация..."
      mt-3
      test-id="cyrillic-transliteration-output"
    />

    <div mt-3 flex justify-center>
      <c-button :disabled="!output" @click="copy()">
        Копировать
      </c-button>
    </div>
  </c-card>
</template>
