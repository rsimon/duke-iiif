import fs from 'fs';

const convertOne = (filename) => {
  const str = fs.readFileSync(filename, { encoding: 'utf-8' });
  const data = JSON.parse(str);

  const source = filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.jpg'));

  // Crosswalk 'objects' to W3C annotations
  const annotations = data.objects.map(obj => {
    const { 
      id,
      tags,
      points,
      classTitle,
      createdAt,
      updatedAt,
      labelerLogin
    } = obj;

    const classBody = {
      purpose: 'classifying',
      value: classTitle,
      created: createdAt,
      updated: updatedAt,
      creator: labelerLogin
    }

    const tagBodies = tags.map(tag => ({
      id: tag.id,
      value: `${tag.name}: ${tag.value}`,
      purpose: 'tagging',
      created: tag.createdAt,
      updated: tag.updatedAt,
      creator: tag.labelerLogin
    }));

    const svgPoints = points.exterior.map(xy => xy.join(',')).join(' ');

    const target = {
      source: `${source}.jpg`,
      selector: {
        type: 'SvgSelector',
        value: `<svg><polygon points="${svgPoints}" /></svg>`
      }
    }

    return {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      type: 'Annotation',
      id,
      body: [classBody, ...tagBodies],
      target
    }
  });

  fs.writeFileSync(`../data/annotations/lisbon/${source}.w3c.json`, JSON.stringify(annotations, null, 2));

  return annotations;
}

/*
const FILES = [
  'caminha2',
  'castelo_bom1',
  'castelo_branco1',
  'chaves2',
  'lapela1',
  'melgaco2',
  'mirando_do_douro2',
  'mogadouro1',
  'monforte_do_rio_livre1',
  'monforte2',
  'moura2',
  'nisa1',
  'ouguela1',
  'segura1',
  'vinhais1'
];
*/

const FILES = [
  'Lisbon_1600_COT_Rumsey',
  'Merian_Lisbon_38'
];

for (const file of FILES) {
  convertOne(`../data/annotations/lisbon/${file}.jpg_poly.json`);
}