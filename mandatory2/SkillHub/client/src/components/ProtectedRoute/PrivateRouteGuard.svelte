<script>
    import { user } from "../../stores/user.js";
    import checkSession from "../../util/checkSession.js";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let isLoading = writable(true);

    onMount(async () => {
        const userData = await checkSession();
        isLoading.set(false);
        if (!userData) {
            navigate("/Unauthorized", { replace: true });
        } else {
            user.set(userData);
        }
    });
</script>

{#if $isLoading}
    <div>Loading...</div>
{:else if $user}
    <slot />
{:else}
    <p>Unauthorized</p>
{/if}
