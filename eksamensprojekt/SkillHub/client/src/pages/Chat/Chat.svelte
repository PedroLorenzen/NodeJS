<script>
    import { onMount } from "svelte";
    import io from "socket.io-client";

    let messages = [];
    let message = "";
    let socket;
    const otherUserId = 2;

    onMount(async () => {
        socket = io("http://localhost:8080");

        try {
            const response = await fetch(
                `http://localhost:8080/chats?otherUserId=${otherUserId}`,
                {
                    credentials: "include",
                },
            );
            const data = await response.json();
            if (response.ok) {
                messages = data.chat || [];
            } else {
                console.error("Error fetching chat history:", data.message);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
        }

        socket.on("chat-message", (data) => {
            messages = [...messages, data];
        });
    });

    async function sendMessage() {
        if (message.trim() === "") return;

        const newMessage = {
            text: message,
            timestamp: Date.now(),
            user_id: otherUserId + 1,
        }; // Assuming the message is from the current user
        socket.emit("send-chat-message", newMessage);

        try {
            const response = await fetch(
                `http://localhost:8080/chats?otherUserId=${otherUserId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMessage),
                },
            );
            const data = await response.json();
            if (!response.ok) {
                console.error("Error saving message:", data.message);
            }
        } catch (error) {
            console.error("Error saving message:", error);
        }

        message = ""; // Clear the input field
    }
</script>

<main>
    <div class="header">
        <h1>Chat</h1>
    </div>
    <div class="chat-container">
        <div class="input-container">
            <input
                type="text"
                class="chat-input"
                placeholder="Type a message..."
                bind:value={message}
                on:keydown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button on:click={sendMessage}>Send</button>
        </div>

        <div class="message-container">
            {#each messages as { text, timestamp, user_id }}
                {#if user_id === otherUserId}
                    <div class="message-other">
                        {text}
                        <small>({new Date(timestamp).toLocaleString()})</small>
                    </div>
                {:else}
                    <div class="message-mine">
                        {text}
                        <small>({new Date(timestamp).toLocaleString()})</small>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</main>

<style>
    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    main {
        background-color: #f9f9f9;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: auto;
    }

    .input-container {
        display: flex;
        width: 100%;
        margin-bottom: 20px;
    }

    .chat-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        margin-right: 10px;
        font-size: 16px;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }

    .message-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
    }

    .message-other,
    .message-mine {
        padding: 10px;
        border-radius: 10px;
        max-width: 60%;
        word-wrap: break-word;
    }

    .message-other {
        align-self: flex-start;
        background-color: #218838;
        color: #fff;
        cursor: default;
    }

    .message-mine {
        align-self: flex-end;
        background-color: #28a745;
        color: #fff;
        cursor: default;
    }

    small {
        display: block;
        font-size: 10px;
        color: #ddd;
    }
</style>
