import App from './App.svelte';

import './index.css';

import '@annotorious/openseadragon/annotorious-openseadragon.css';

const app = new App({
  target: document.getElementById('app')!
})

export default app
