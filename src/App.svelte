<script lang="ts">
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import { OpenSeadragonAnnotator } from '@annotorious/svelte';
  import Storage from './Storage/Storage.svelte';
  import { Inspector } from './Inspector';

  let container: HTMLDivElement;

  let viewer: OpenSeadragon.Viewer;

  onMount(() => {
    const imagename = location.hash.substring(1) || 'book-of-fortresses/caminha2';

    viewer = OpenSeadragon({
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

  <OpenSeadragonAnnotator viewer={viewer}>
    <Storage url="caminha2.w3c.json" />
    <Inspector />
  </OpenSeadragonAnnotator>
</div>

<style>
  .container, .openseadragon {
    height: 100%;
    width: 100%;
  }
</style>