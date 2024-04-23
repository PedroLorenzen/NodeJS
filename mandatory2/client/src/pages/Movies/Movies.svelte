<script lang="ts">
    import { onMount } from 'svelte';
    import { BASE_URL } from '../../stores/generalStore';
    import { fetchGet } from '../../util/api';

    interface Movie {
        title: string;
        director: string;
        year: number;
    }

    let movies: Movie[] | undefined = [];

    onMount(async () => {
        const fetchedMovies = await fetchGet<Movie[]>($BASE_URL + '/api/movies');
        if (fetchedMovies) {
            movies = fetchedMovies;
        } else {
            console.error('Failed to fetch movies or no movies available.');
            movies = [];
        }
    });
</script>

<h1>Movies</h1>

{#if movies && movies.length > 0}
    {#each movies as movie}
        <h2>{movie.title}</h2>
        <h3>{movie.director}</h3>
        <p>{movie.year}</p>
    {/each}
{:else}
    <p>No movies available.</p>
{/if}
