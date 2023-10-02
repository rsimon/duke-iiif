<script lang="ts">
  import { OpenSeadragonAnnotator } from '@annotorious/openseadragon';
  import { getContext, onMount } from 'svelte';

  export let url: string;

  const anno: OpenSeadragonAnnotator = getContext('anno');

  onMount(() => {
    anno.loadAnnotations(url);
  });
</script>