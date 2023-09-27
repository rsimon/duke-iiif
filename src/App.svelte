<script lang="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';

  let container: HTMLDivElement;

  onMount(() => {
    const imagename = location.hash.substring(1) || 'book-of-fortresses/caminha2';

    const viewer = OpenSeadragon({
      element: container,
      prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
      crossOriginPolicy: 'Anonymous',
      tileSources: `https://iiif.rainersimon.io/${imagename}/info.json`,
      gestureSettingsMouse: {
        clickToZoom: false
      }
    });
  });
</script>

<div class="container">
  <div 
    bind:this={container}
    class="openseadragon" />
</div>

<style>
  .container, .openseadragon {
    height: 100%;
    width: 100%;
  }
</style>