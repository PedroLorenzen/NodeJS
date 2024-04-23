<script>
    import { onMount } from 'svelte';
    import { BASE_URL } from '../../stores/generalStore';
    import { fetchGet } from '../../util/api';

    let movies = [];

    onMount(async () => {
        movies = (await fetchGet($BASE_URL + '/api/movies')) ?? [];
    });
</script>

<h1>Movies</h1>

{#each movies as movie}
    <h2>{movie.title}</h2>
    <h3>{movie.director}</h3>
    <p>{movie.year}</p>
{/each}
