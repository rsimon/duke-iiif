<script lang="ts">
  import { AnnotoriousOpenSeadragonAnnotator } from '@annotorious/openseadragon';
  import { getContext } from 'svelte';

  const anno: AnnotoriousOpenSeadragonAnnotator = getContext('anno');

  const { selection } = anno.state;

  anno.startDrawing('rectangle');
</script>

<div class="sidebar">
  Hello World 
  {$selection.selected}
</div>

<style>
  div.sidebar {
    position: absolute;
    top: 0; 
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #fff;
  }
</style>