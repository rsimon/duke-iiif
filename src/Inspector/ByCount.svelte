<script lang="ts">
  import { getContext } from 'svelte';
  import { ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import { colorTheme } from '../colorTheme';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { store, viewport } = anno.state;

  const { legend } = colorTheme;

  $: totalCounts = getCountStats($store);

  $: viewportCounts = getViewportCounts($viewport);

  // Computes stats by number of annotations per class
  const getCountStats = (annotations: ImageAnnotation[]) => {
    // Each annotation has one class - aggregate!
    const histogram = new Map<string, number>();

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
    return getCountStats(annotations);
  }

</script>

{#if totalCounts?.length > 0}
  {@const max = totalCounts[0][1]}
  <ul class="stats by-count">
    {#each totalCounts as [label, count]}
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
