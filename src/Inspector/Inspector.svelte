<script lang="ts">
  import { onMount } from 'svelte';
  import { ImageAnnotation, StoreChangeEvent } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import { getContext } from 'svelte';
  import { computeArea } from './computeArea';
  import { colorTheme } from '../colorTheme';
  import ByCount from './ByCount.svelte';
  import ByArea from './ByArea.svelte';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { store } = anno.state;

  const { style } = colorTheme;

  anno.setFormatter(style);

  // Annotation ID -> area
  const areaIndex = new Map<string, number>();

  let panel = 'by-count';

  const onToggle = () => {
    if (panel === 'by-count') {
      panel = 'by-area';
    } else {
      panel = 'by-count';
    }
  }

  onMount(() => {
    const onStoreChange = ((event: StoreChangeEvent<ImageAnnotation>) => {
      // Simple implementation will break for editable annotations!
      const { created } = event.changes;

      created.forEach(annotation => {
        const area = computeArea(annotation);
        areaIndex.set(annotation.id, area);
      });
    });

    store.observe(onStoreChange);

    return () => {
      store.unobserve(onStoreChange);
    }
  });
</script>

<div class="overlay inspector">
  <button 
    on:click={onToggle}>Toggle</button>
  
  {#if panel === 'by-count'}
    <ByCount />
  {:else}
    <ByArea areaIndex={areaIndex} />
  {/if}
</div>