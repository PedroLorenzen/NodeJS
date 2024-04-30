import { writable } from 'svelte/store';

export const user = writable(null);

export const userDetails = writable({
    id: null,
    email: '',
    name: '',
    location: '',
  });