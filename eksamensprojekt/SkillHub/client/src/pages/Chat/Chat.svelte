<script>
    import { onMount } from "svelte";
    import io from "socket.io-client";

    let color = "#ffffff";
    let messages = [];
    let message = "";
    let socket;

    onMount(() => {
        socket = io("http://localhost:8080");

        socket.on("chat-message", (data) => {
            messages = [...messages, data];
        });
    });

    function sendMessage() {
        socket.emit("send-chat-message", { message });
        message = "";
    }
</script>

<style>
    /* Add your styles here */
</style>

<div>
    <input type="text" placeholder="Message" bind:value={message} on:keydown={e => e.key === 'Enter' && sendMessage()}>
    <button on:click={sendMessage}>Send Message</button>

    <div>
        {#each messages as { message }}
            <div>{message}</div>
        {/each}
    </div>
</div>