<script lang="ts">
  import { getContext } from 'svelte';
  import { ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import { colorTheme } from '../colorTheme';

  export let areaIndex: Map<string, number>;

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { store, viewport } = anno.state;

  const { legend } = colorTheme;

  $: totalAreaStats = getAreaStats($store);

  $: viewportAreaStats = getViewportAreaStats($viewport);

  $: totalArea = totalAreaStats.reduce((total, [_, area]) => total + area, 0);

  // Computes stats by area per class
  const getAreaStats = (annotations: ImageAnnotation[]) => {
    const histogram = new Map<string, number>();

    annotations.forEach(annotation => {
      const cls = annotation.bodies.find(b => b.purpose === 'classifying')?.value;
      if (cls) {
        const areaForThisClass = histogram.get(cls) || 0;
        histogram.set(cls, areaForThisClass + (areaIndex.get(annotation.id) || 0));
      }
    });

    const sorted = Array.from(histogram.entries());
    sorted.sort((a, b) => b[1] - a[1]);

    return sorted;
  }

  const getViewportAreaStats = (annotationIds: string[]) => {
    const annotations = annotationIds.map(store.getAnnotation);
    return getAreaStats(annotations);
  }

  const percent = (n: number) => (100 * n / totalArea).toFixed(1);
</script>

{#if totalAreaStats?.length > 0}
  {@const max = totalAreaStats[0][1]}
  <ul class="stats by-count">
    {#each totalAreaStats as [label, count]}
      {@const inViewport = viewportAreaStats.find(([l,]) => l === label)}
      <li>
        <span 
          class="label"
          class:disabled={!inViewport}>
          {label} 
          
          <span class="count">{inViewport ? percent(inViewport[1]) : 0}% / {percent(count)}%</span>
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
