<script lang="ts">
  import { ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import { getContext } from 'svelte';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { store, viewport } = anno.state;

  $: totals = getTotals($store);

  $: viewportCounts = getViewportCounts($viewport);

  const getTotals = (annotations: ImageAnnotation[]) => {
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
    sorted.sort((a, b) => a[1] - b[1]);

    return sorted;
  }

  const getViewportCounts = (annotationIds: string[]) => {
    console.log('get viewport counts');
  }
</script>

<div class="inspector panel">
  Hello World 
  <ul>
    {#each totals as [label, count]}
      <li>{label}: {count}</li>
    {/each}
  </ul>
</div>

<style>
  .inspector {
    position: absolute;
    right: 20px;
    top: 20px;
  }
</style>