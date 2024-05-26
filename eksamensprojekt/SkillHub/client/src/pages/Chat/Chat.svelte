<script>
    import { onMount } from "svelte";
    import io from "socket.io-client";
    import { navigate } from "svelte-routing";
    import toast from "svelte-french-toast";

    let messages = [];
    let message = "";
    let socket;
    let otherUserId = parseInt(localStorage.getItem("contact_user_id"));
    let name = "";

    onMount(async () => {
        socket = io("http://localhost:8080");

        try {
            const userResponse = await fetch(
                `http://localhost:8080/users?getUserById=${otherUserId}`,
                {
                    credentials: "include",
                },
            );
            if (userResponse.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (!userResponse.ok) {
                throw new Error(
                    "Failed to fetch user: " + (await userResponse.text()),
                );
            }
            let data = await userResponse.json();
            name = data.user.name;
        } catch (error) {
            throw new Error("Error fetching user: " + error);
        }

        try {
            const response = await fetch(
                `http://localhost:8080/chats?otherUserId=${otherUserId}`,
                {
                    credentials: "include",
                },
            );
            if (response.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (response.status === 404) {
                toast.error("No chat exists, creating new chat...");
                const newChatResponse = await fetch(
                    `http://localhost:8080/chats?otherUserId=${otherUserId}`,
                    {
                        method: "POST",
                        credentials: "include",
                    },
                );
                if (newChatResponse.status === 429) {
                    navigate("/RateLimitExceeded");
                    throw new Error("Rate limit exceeded");
                } else if (!newChatResponse.ok) {
                    throw new Error(
                        "Failed to create new chat: " + newChatResponse.text());
                }
                window.location.reload();
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    "Failed to fetch chat history: " + data.message,
                );
            }
            messages = data.chat || [];
        } catch (error) {
            throw new Error("Error fetching chat history: " + error);
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
        };
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
                throw new Error("Failed to save message: " + data.message);
            }
        } catch (error) {
            throw new Error("Error saving message: " + error);
        }

        message = "";
    }
</script>

<main>
    <div class="header">
        <h1>Chat</h1>
        <h2>You are chatting with {name || "Not Available"}</h2>
    </div>
    <div class="chat-container">
        <div class="input-container">
            <textarea
                class="chat-input"
                placeholder="Type a message..."
                bind:value={message}
                on:click={sendMessage}
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
    main {
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        background-color: white;
        width: 100%;
        padding: 5px 30px 50px 30px;
        margin-top: 25px;
        margin-left: -30px;
        margin-right: 50px;
    }
    .header {
        text-align: center;
        margin-bottom: 20px;
        color: #333;
    }
    .chat-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: lightgrey;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
        width: 60%;
        margin: auto;
        margin-bottom: 10px;
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
        border-radius: 5px;
        margin-right: 10px;
        font-size: 16px;
    }
    button {
        padding: 10px 40px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    .message-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
    }
    .message-other {
        align-self: flex-start;
        background-color: #218838;
        color: #fff;
        cursor: default;
        padding: 10px;
        border-radius: 10px;
        max-width: 60%;
        word-wrap: break-word;
    }
    .message-mine {
        align-self: flex-end;
        background-color: #28a745;
        color: #fff;
        cursor: default;
        padding: 10px;
        border-radius: 10px;
        max-width: 60%;
        word-wrap: break-word;
    }
    small {
        display: block;
        font-size: 10px;
        color: #ddd;
    }
</style>
