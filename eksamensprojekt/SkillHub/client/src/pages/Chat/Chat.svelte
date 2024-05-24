<script>
    import { onMount, onDestroy } from 'svelte';
    import io from 'socket.io-client';
    import { user } from '../../stores/user.js';
    import { get } from 'svelte/store';

    let socket;
    let messages = [];
    let message = '';
    let chatUser = null;
    let loggedInUser = get(user);

    user.subscribe(value => {
        loggedInUser = value;
    });

    onMount(async () => {
        socket = io('http://localhost:3000');

        socket.on('chat message', (msg) => {
            messages = [...messages, msg];
        });

        const response = await fetch(`http://localhost:8080/users?getUser=true`);
        const data = await response.json();
        chatUser = data;

        // Emit a message to join the room for the two users
        socket.emit('join', { from: loggedInUser.id, to: chatUser._id });
    });

    onDestroy(() => {
        socket.disconnect();
    });

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('chat message', {
                from: loggedInUser.name,
                to: chatUser.name,
                text: message,
            });
            message = '';
        }
    };
</script>

<style>
    .chat {
        max-width: 500px;
        margin: 0 auto;
        padding: 1em;
        border: 1px solid #ccc;
    }
    .messages {
        list-style: none;
        padding: 0;
    }
    .message {
        margin: 0.5em 0;
    }
    .message span {
        font-weight: bold;
    }
</style>

<div class="chat">
    <h2>Chat with {chatUser ? chatUser.name : 'Loading...'}</h2>
    <ul class="messages">
        {#each messages as msg}
            <li class="message">
                <span>{msg.from}:</span> {msg.text}
            </li>
        {/each}
    </ul>

    <input type="text" bind:value={message} on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
    <button on:click={sendMessage}>Send</button>
</div>