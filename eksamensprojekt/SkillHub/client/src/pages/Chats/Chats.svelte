<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";
    import { get } from "svelte/store";
    import { user } from "../../stores/user.js";

    let chats = [];
    let myId = get(user).user._id;
    let users = [];

    async function fetchAllUsers() {
        try {
            const response = await fetch("http://localhost:8080/users", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(
                    "Failed to fetch users: " + (await response.text()),
                );
            }
            let result = await response.json();
            users = result.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error fetching users: " + error.message);
        }
    }

    function getUserById(id) {
        const otherUser = users.find((otherUser) => otherUser._id === id);
        if (otherUser && otherUser._id !== myId) {
            return otherUser.name;
        } else {
            throw new Error("User not found");
        }
    }

    onMount(async () => {
        try {
            await fetchAllUsers();

            const response = await fetch("http://localhost:8080/chats", {
                credentials: "include",
            });
            if (response.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (!response.ok) {
                throw new Error(
                    "Failed to fetch chats: " + (await response.text()),
                );
            }
            let data = await response.json();
            chats = data.chats.map((chat) => {
                const otherUserId = chat.user_ids.find((id) => id !== myId);
                return {
                    ...chat,
                    otherUserId,
                    otherUserName: getUserById(otherUserId),
                };
            });
            console.log(chats);
            console.log(chats);
        } catch (error) {
            console.error("Error fetching chats:", error);
            toast.error("Error fetching chats: " + error.message);
        }
    });

    function contactUser(otherUserId) {
        localStorage.setItem("contact_user_id", otherUserId);
        window.location.href = "/Chat";
    }
</script>

<main>
    <h1>Your Chats</h1>
    <div class="chats-container">
        {#each chats as chat}
            <div class="chat">
                <h2>{chat.otherUserName}</h2>
                <button
                    type="button"
                    on:click={() => contactUser(chat.otherUserId)}
                    class="contact-user-button"
                >
                    Open Chat
                </button>
            </div>
        {/each}
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
    h1 {
        text-align: center;
        color: black;
    }
    .chat {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 30px 20px 30px;
        background: lightgrey;
        border-radius: 8px;
        color: black;
        border: 1px solid #ccc;
        box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
        width: 40%;
        margin: 40px auto;
    }
    .contact-user-button {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }
    .contact-user-button:hover {
        background-color: #218838;
    }
</style>
