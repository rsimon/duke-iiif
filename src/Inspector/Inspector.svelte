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
    sorted.sort((a, b) => b[1] - a[1]);

    return sorted;
  }

  const getViewportCounts = (annotationIds: string[]) => {
    console.log('get viewport counts');
  }
</script>

<div class="inspector panel">
  {#if totals?.length > 0}
    {@const max = totals[0][1]}
    <ul class="stats">
      {#each totals as [label, count]}
        <li>
          <span class="label">
            {label} <span class="count">{count}</span>
          </span>
          <div class="meter-wrapper">
            <div class="meter-value" style={`width: ${100 * (count / max)}%`} />
          </div> 
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .inspector {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  ul {
    margin: 0;
    list-style-type: none;
    padding: 0;
  }

  .label {
    font-size: 12px;
  }

  .count {
    color: rgba(255, 255, 255, 0.45);
    display: inline-block;
    margin-left: 0.3em;
  }

  .meter-wrapper {
    box-sizing: border-box;
    margin: 5px 0;
    padding: 0 2px;
    position: relative;
    width: 100%;
  }

  .meter-value {
    background-color: #fff;
    border-radius: 3px;
    height: 6px;
  }
</style>