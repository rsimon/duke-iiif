<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { ImageAnnotation } from '@annotorious/openseadragon';
  import { SvelteAnnotator } from '@annotorious/svelte';

  const anno = getContext<SvelteAnnotator<ImageAnnotation>>('anno');

  const { hover } = anno.state;

  const viewer = getContext<OpenSeadragon.Viewer>('viewer');

  onMount(() => {
    const onPointerMove = (event: PointerEvent) => {
      console.log(event);
    }

    viewer.element.addEventListener('pointermove', onPointerMove);

    return () => {
      viewer.element.removeEventListener('pointermove', onPointerMove);
    }
  });
</script>

<div class="tooltip">
  Hello World
</div>

<style>
  .tooltip {

  }
</style>