import { ShapeType } from '@annotorious/openseadragon';
import type { ImageAnnotation, Polygon, Rectangle } from '@annotorious/openseadragon';

const rectArea = (rectangle: Rectangle) => {
  const { w, h } = rectangle.geometry;
  return w * h;
}

const polyArea = (polygon: Polygon) => {
  const { points } = polygon.geometry;

  let area = 0;
  let j = points.length - 1;

  for (let i = 0; i < points.length; i++) {
    area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
    j = i;
  }

  return Math.abs(0.5 * area);
}

export const computeArea = (annotation: ImageAnnotation) => {
  const { selector } = annotation.target;

  if (selector.type === ShapeType.RECTANGLE) {
    return rectArea(selector as Rectangle);
  } else if (selector.type === ShapeType.POLYGON) {
    return polyArea(selector as Polygon);
  } else {
    console.error('Unsupported shape type', annotation);
    return 0;
  }
}
