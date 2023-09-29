<script lang="ts">
  import { AnnotoriousOpenSeadragonAnnotator } from '@annotorious/openseadragon';
  import { getContext } from 'svelte';

  export let url: string;

  const anno: AnnotoriousOpenSeadragonAnnotator = getContext('anno');

  anno.loadAnnotations(url);
</script>