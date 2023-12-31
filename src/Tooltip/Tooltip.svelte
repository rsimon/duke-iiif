<script lang="ts">
  import { getContext } from 'svelte';
  import { Annotation } from '@annotorious/openseadragon';
  import { MouseOverTooltip } from '@annotorious/svelte';
  import Time from 'svelte-time';
  import { colorTheme } from '../colorTheme';

  const { legend } = colorTheme;

  const viewer = getContext<OpenSeadragon.Viewer>('viewer');

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
</script>

<MouseOverTooltip
  container={viewer.element}
  let:hovered>
  
  <h1>
    <span class="pip" style={`background-color:${$legend[getClass(hovered)]}`} />
    {getClass(hovered)}
  </h1>
  <ul class="tags">
    {#each getTags(hovered) as tag}
      <li>{tag.substring(tag.indexOf(':') + 1).trim()}</li>
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
</MouseOverTooltip>

<style>
  h1 {
    font-size: 14px;
    margin: 0 1em 0 0;
    padding: 0 0 0.5em 0;
    max-width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pip {
    border-radius: 50%;
    display: inline-block;
    margin: 0 0.2em 1px 0;
    height: 9px;
    vertical-align: baseline;
    width: 9px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
  }

  ul.tags:empty {
    display: none;
  }

  ul.tags {
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    gap: 0.4em;
    padding: 0.2em 0;
  }

  ul.tags li {
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 3px;
    padding: 1px 3px;
  }

  .footer {
    color: rgba(255, 255, 255, 0.45);
    display: flex;
    flex-direction: row;
    font-size: 12px;
    justify-content: space-between;
    padding-top: 0.4em;
  }
</style>