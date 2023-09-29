import { writable } from 'svelte/store';
import { Color, Annotation } from '@annotorious/openseadragon';

export const AdobeCategorical12 = [
  '#11b5ae', // cyan
  '#4046ca', // dark blue
  '#f68512', // orange
  '#f22483', // pink
  '#7e84fa', // light blue
  '#72e06a', // green
  '#167af3', // blue
  '#7326d3', // purple
  '#e8c600', // yellow
  '#cb5d02', // brown
  '#008f5d', // dark green
  '#bce931'  // mint
] as Color[];

const Palette = AdobeCategorical12;

const createTheme = () => { 
  
  const colors = new Map<string, Color>();

  // A reactive store copy of the color legend
  const legend = writable<{ [key: string]: Color }>({});

  const style = (annotation: Annotation) => {
    const cls = annotation.bodies.find(a => a.purpose === 'classifying')?.value;

    if (cls) {
      let color = colors.get(cls);

      if (!color) {
        const next = Palette[colors.size % Palette.length];
        colors.set(cls, next);
        legend.set(Object.fromEntries(colors.entries()));
        color = next; 
      }

      return {
        fill: color,
        fillOpacity: 0.25
      };
    }
  }

  return { style, legend };

}

export const colorTheme = createTheme();