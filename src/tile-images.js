import { build } from 'biiif';

const IMAGES = [
  // 'caminha2',
  // 'castelo_bom1',
  'castelo_branco1',
  'chaves2',
  'lapela1',
  'melgaco2',
  'mirando_do_douro2',
  'mirando_do_douro2_Altered',
  'mogadouro1',
  'monforte_do_rio_livre1',
  'monforte2',
  'moura2',
  'nisa1',
  'ouguela1',
  'segura1',
  'vinhais1'
]

for (const image of IMAGES) {
  build(`images/book_of_fortresses/${image}`, `https://iiif.rainersimon.io/book-of-fortresses/${image}`);
}