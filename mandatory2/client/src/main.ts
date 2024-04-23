import './app.css';
import App from './App.svelte';

const appElement = document.getElementById('app');
let app: App | undefined;

if (appElement) {
    app = new App({
        target: appElement,
    });
    console.error('Failed to mount the Svelte app: #app element not found.');
}

export default app;
