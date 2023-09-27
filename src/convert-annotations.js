import fs from 'fs';

const convertOne = (filename) => {
  const str = fs.readFileSync(filename, { encoding: 'utf-8' });
  const data = JSON.parse(str);

  const source = filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.jpg'));
  console.log(source);

  // Crosswalk 'objects' to W3C annotations
  const annotations = data.objects.map(obj => {
    const { 
      id,
      tags,
      points
    } = obj;

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
      body: tagBodies,
      target
    }
  });

  fs.writeFileSync(`./annotations/${source}.w3c.json`, JSON.stringify(annotations, null, 2));

  return annotations;
}

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

for (const file of FILES) {
  convertOne(`./annotations/${file}.jpg_poly.json`);
}