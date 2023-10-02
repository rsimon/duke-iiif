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

  let panel: 'by-count' | 'by-area' = 'by-count';

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
  <div class="buttons">
    <button
      on:click={() => panel = 'by-area'}
      class:active={panel === 'by-area'}>By Area</button>
    <button 
      on:click={() => panel = 'by-count'}
      class:active={panel === 'by-count'}>By Count</button>
  </div>
  
  {#if panel === 'by-count'}
    <ByCount />
  {:else}
    <ByArea areaIndex={areaIndex} />
  {/if}
</div>

<style>
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: flex-end;
    padding-bottom: 0.8em;
  }

  button {
    all: unset;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 12px;
    padding: 4px 8px;
    transition: background-color 150ms, color 150ms;
  }

  button.active {
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.9);
    color: rgba(0, 0, 0, 0.8);
  }

  button:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
  }
</style>