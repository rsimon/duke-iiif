<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { Annotation, ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';
  import Time from 'svelte-time';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { store, hover } = anno.state;

  const viewer = getContext<OpenSeadragon.Viewer>('viewer');

  let top: number;

  let left: number;

  $: hovered = $hover ? store.getAnnotation($hover) : undefined;

  const getClass= (annotation: Annotation): string | undefined  =>
    annotation.bodies.find(b => b.purpose === 'classifying')?.value;

  const getTags = (annotation: Annotation): string[] =>
    annotation.bodies.filter(b => b.purpose === 'tagging').map(b => b.value);

  const getContributors = (annotation: Annotation): string[] =>
    // TODO annotations are parsed wrong - b.creator should be a User, not a string!
    Array.from(new Set(annotation.bodies
      .filter(b => Boolean(b.creator))
      .map(b => b.creator as unknown as string)));

  const getLastUpdate = (annotation: Annotation): Date | undefined => {
    const timestamps = annotation.bodies
      .filter(b => Boolean(b.created))
      .map(b => b.created);

    timestamps.sort();

    return timestamps[timestamps.length - 1];
  }
  
  onMount(() => {
    const onPointerMove = (event: PointerEvent) => {
      const { offsetX, offsetY } = event;

      left = offsetX;
      top = offsetY;
    }

    viewer.element.addEventListener('pointermove', onPointerMove);

    return () => {
      viewer.element.removeEventListener('pointermove', onPointerMove);
    }
  });
</script>

{#if $hover}
  <div class="overlay tooltip" style={`left:${left}px; top:${top}px`}>
    <h1>{getClass(hovered)}</h1>
    <ul class="tags">
      {#each getTags(hovered) as tag}
        <li>{tag}</li>
      {/each}
    </ul>

    <div class="footer">
      <ul class="contributors">
        {#each getContributors(hovered) as contributor}
          <li>{contributor}</li>
        {/each}
      </ul>

      <Time timestamp={getLastUpdate(hovered)} />
    </div>
  </div>
{/if}

<style>
  .overlay.tooltip {
    margin: 10px 0 0 10px;
    padding: 10px;
    pointer-events: none;
    position: absolute;
    width: auto;
  }
</style>