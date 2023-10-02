<script lang="ts">
  import { ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import { getContext } from 'svelte';
  import { colorTheme } from '../colorTheme';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { style, legend } = colorTheme;

  anno.setFormatter(style);

  const { store, viewport } = anno.state;

  $: totals = getStats($store);

  $: viewportCounts = getViewportCounts($viewport);

  const getStats = (annotations: ImageAnnotation[]) => {
    // Each annotation has one class - aggregate!
    const histogram = new Map<string, number>;

    annotations.forEach(annotation => {
      const cls = annotation.bodies.find(b => b.purpose === 'classifying')?.value;
      if (cls) {
        const count = histogram.get(cls) || 0;
        histogram.set(cls, count + 1);
      }
    });

    const sorted = Array.from(histogram.entries());
    sorted.sort((a, b) => b[1] - a[1]);

    return sorted;
  }

  const getViewportCounts = (annotationIds: string[]) => {
    const annotations = annotationIds.map(store.getAnnotation);
    return getStats(annotations);
  }
</script>

<div class="overlay inspector">
  {#if totals?.length > 0}
    {@const max = totals[0][1]}
    <ul class="stats">
      {#each totals as [label, count]}
        {@const inViewport = viewportCounts.find(([l,]) => l === label)}
        <li>
          <span 
            class="label"
            class:disabled={!inViewport}>
            {label} <span class="count">{inViewport ? inViewport[1] : 0} / {count}</span>
          </span>
          <div class="meter-wrapper">
            <div 
              class="meter-value-full" 
              style={`width: ${100 * (count / max)}%; background-color:${$legend[label]}`} />

            <div 
              class="meter-value-viewport" 
              style={`width: ${100 * ((inViewport ? inViewport[1] : 0) / max)}%; background-color:${$legend[label]}`} />
          </div> 
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .inspector {
    box-sizing: border-box;
    position: absolute;
    right: 10px;
    top: 10px;
    max-height: calc(100vh - 20px);
    overflow-y: auto;
  }

  .inspector::-webkit-scrollbar {
    background-color: transparent;
    width: 14px;
  }

  .inspector::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .inspector::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 14px;
    background-clip: content-box;
    border: 4px solid transparent;
  }

  .inspector::-webkit-scrollbar-button {
    display: none;
  }

  ul {
    margin: 0;
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 1.2em;
  }

  .label {
    font-size: 12px;
  }

  .label.disabled {
    opacity: 0.2;
  }

  .count {
    color: rgba(255, 255, 255, 0.45);
    display: inline-block;
    margin-left: 0.3em;
  }

  .meter-wrapper {
    box-sizing: border-box;
    margin: 0.2em 0;
    padding: 0 1px;
    position: relative;
    width: 100%;
  }

  .meter-value-full,
  .meter-value-viewport {
    background-color: #fff;
    border-radius: 3px;
    height: 6px;
    left: 0;
    position: absolute;
    top: 0;
  }

  .meter-value-full {
    opacity: 0.4;
  }
</style>