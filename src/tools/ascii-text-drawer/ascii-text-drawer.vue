<script setup lang="ts">
import figlet from 'figlet';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const input = ref('Ascii ART');
const font = useStorage('ascii-text-drawer:font', 'Standard');
const width = useStorage('ascii-text-drawer:width', 80);
const output = ref('');
const errored = ref(false);
const processing = ref(false);

const fontLoaders = import.meta.glob<string>('./fonts/*.flf', { query: '?raw', import: 'default' });
const fonts = [...new Set(Object.keys(fontLoaders)
  .map(key => key.replace(/^\.\/fonts\//, '').replace(/\.flf$/, '')))]
  .sort((a, b) => a.localeCompare(b));
const fontCache = new Map<string, Promise<string>>();
let renderId = 0;

function loadFont(name: string): Promise<string> {
  const cached = fontCache.get(name);
  if (cached) {
    return cached;
  }

  const loader = fontLoaders[`./fonts/${name}.flf`];
  if (!loader) {
    return Promise.reject(new Error(`Unknown font: ${name}`));
  }

  const promise = loader();
  fontCache.set(name, promise);
  return promise;
}

watch([input, font, width], async ([inputValue, fontValue, widthValue]) => {
  const id = ++renderId;
  processing.value = true;
  errored.value = false;

  try {
    const text = String(inputValue ?? '');
    const selectedFont = String(fontValue ?? '');
    const selectedWidth = Number(widthValue);

    if (!text) {
      output.value = '';
      return;
    }
    if (!selectedFont || !Number.isFinite(selectedWidth) || selectedWidth < 0) {
      throw new Error('Invalid ASCII text settings');
    }

    figlet.parseFont(selectedFont, await loadFont(selectedFont));
    const rendered = await new Promise<string>((resolve, reject) => {
      figlet.text(text, {
        font: selectedFont as figlet.Fonts,
        width: selectedWidth,
        whitespaceBreak: true,
      }, (err, value) => (err ? reject(err) : resolve(value ?? '')));
    });

    if (id === renderId) {
      output.value = rendered;
    }
  }
  catch {
    if (id === renderId) {
      output.value = '';
      errored.value = true;
    }
  }
  finally {
    if (id === renderId) {
      processing.value = false;
    }
  }
}, { immediate: true });
</script>

<template>
  <c-card style="max-width: 600px;">
    <c-input-text
      v-model:value="input"
      label="Your text:"
      placeholder="Your text to draw"
      raw-text
      multiline
      rows="4"
    />

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="font"
          label-position="top"
          label="Font:"
          :options="fonts"
          searchable="true"
          placeholder="Select font to use"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item label="Width:" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="width" min="0" max="10000" w-full placeholder="Width of the text" />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <div v-if="processing" flex items-center justify-center>
      <n-spin size="medium" />
      <span class="ml-2">Loading font...</span>
    </div>

    <c-alert v-if="errored" mt-1 text-center type="error">
      Current settings resulted in error.
    </c-alert>

    <n-form-item v-if="!processing && !errored" label="Ascii Art text:">
      <TextareaCopyable
        :value="output"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
  </c-card>
</template>
