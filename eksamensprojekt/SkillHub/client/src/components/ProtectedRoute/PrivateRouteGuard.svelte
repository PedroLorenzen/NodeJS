<script>
    import { user } from "../../stores/user.js";
    import checkSession from "../../util/checkSession.js";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    const isLoading = writable(true);
    const isAuthorized = writable(false);
    const isError = writable(false);

    onMount(async () => {
        try {
            const userData = await checkSession();
            if (userData) {
                user.set(userData);
                isAuthorized.set(true);
            } else {
                navigate("/Unauthorized", { replace: true });
            }
        } catch (error) {
            isError.set(true);
        } finally {
            isLoading.set(false);
        }
    });
</script>

{#if $isLoading}
    <div>Loading...</div>
{:else if $isError}
    <p>Error occurred while checking session.</p>
{:else if $isAuthorized}
    <slot />
{/if}