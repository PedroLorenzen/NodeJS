<script>
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";
    import { BASE_URL } from "../../stores/url.js";
    import sanitizeHTML from "../../util/sanitize.js";

    let showLogin = true;
    let showRegister = false;
    let email = "";
    let password = "";
    let name = "";
    let location = "";

    async function postLogin() {
        const sanitizedEmail = sanitizeHTML(email);
        const sanitizedPassword = sanitizeHTML(password);
        const response = await fetch($BASE_URL + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: sanitizedEmail,
                password: sanitizedPassword,
            }),
            credentials: "include",
        });
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            return;
        }
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to login");
        }
        setTimeout(() => {
            navigate("/User");
        }, 2000);
    }

    async function handlePostLogin() {
        await toast.promise(
            postLogin(),
            {
                loading: "Logging in...",
                success: "Login successful - redirecting...",
                error: "Failed to login - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }

    async function postRegister() {
        const sanitizedEmail = sanitizeHTML(email);
        const sanitizedPassword = sanitizeHTML(password);
        const sanitizedName = sanitizeHTML(name);
        const sanitizedLocation = sanitizeHTML(location);
        const response = await fetch($BASE_URL + "/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: sanitizedName,
                email: sanitizedEmail,
                password: sanitizedPassword,
                location: sanitizedLocation,
            }),
        });
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            return;
        }
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to register");
        }
        handlePostLogin();
    }

    async function handlePostRegister() {
        await toast.promise(
            postRegister(),
            {
                loading: "Registering new user...",
                success:
                    "You have been registered successfully - Redirecting...",
                error: "Failed to register - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }

    function toggleLogin() {
        showLogin = true;
        showRegister = false;
    }

    function toggleRegister() {
        showRegister = true;
        showLogin = false;
    }
</script>

<Toaster />

<main>
    <div>
        <h1 class="text">Welcome to SKILLHUB</h1>
        <p class="text">Share your skills or find someone who can help you</p>
    </div>
    <div class="auth-container">
        <div class="button-group">
            <button on:click={toggleLogin}>Login</button>
            <button on:click={toggleRegister}>Create Account</button>
        </div>
        {#if showLogin}
            <form on:submit|preventDefault={handlePostLogin} class="auth-form">
                <label for="email">Email:</label>
                <input type="email" bind:value={email} id="email" required />

                <label for="password">Password:</label>
                <input
                    type="password"
                    bind:value={password}
                    id="password"
                    required
                />

                <button type="submit" class="submit-button">Login</button>
            </form>
        {/if}
        {#if showRegister}
            <form
                on:submit|preventDefault={handlePostRegister}
                class="auth-form"
            >
                <label for="name">Name:</label>
                <input type="text" bind:value={name} id="name" required />

                <label for="email">Email:</label>
                <input type="email" bind:value={email} id="email" required />

                <label for="password">Password:</label>
                <input
                    type="password"
                    bind:value={password}
                    id="password"
                    required
                />

                <label for="location">Location:</label>
                <input
                    type="text"
                    bind:value={location}
                    id="location"
                    required
                />

                <button type="submit" class="submit-button">Signup</button>
            </form>
        {/if}
    </div>
</main>

<style>
    main {
        background-color: white;
        width: 100%;
        padding: 10px 30px 50px 30px;
        margin-top: 35px;
        margin-left: -30px;
        margin-right: 50px;
    }
    .text {
        text-align: center;
        color: black;
    }
    .auth-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        background: lightgrey;
        border-radius: 8px;
        box-shadow: 100px 50px 20px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        margin: 40px auto;
    }

    .button-group {
        margin-bottom: 20px;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        margin-right: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }

    .auth-form {
        display: flex;
        color: white;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        flex-direction: column;
        width: 100%;
    }

    .auth-form label {
        margin-bottom: 5px;
        font-family: Georgia, "Times New Roman", Times, serif;
        color: #333;
        text-align: left;
    }

    .auth-form input {
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .submit-button {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }

    .submit-button:hover {
        background-color: #218838;
    }
</style>
