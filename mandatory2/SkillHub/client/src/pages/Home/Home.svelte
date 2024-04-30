<script>
    import { Link } from "svelte-routing";
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";
    import { BASE_URL } from "../../stores/url.js";

    let showLogin = true;
    let showRegister = false; // Controls visibility of the registration form
    let email = "";
    let password = "";
    let name = "";
    let location = "";

    async function postLogin() {
        const response = await fetch($BASE_URL + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to login");
        }
        setTimeout(() => {
            navigate("/User");
        }, 2000);
    }

    async function handleLoginWithToast() {
        await toast.promise(
            postLogin(),
            {
                loading: "Logging in...",
                success: "Login successful - redirecting...",
                error: "Failed to login - please check your credentials",
            },
            {
                duration: 2000,
            },
        );
    }

    async function postRegister() {
        const response = await fetch($BASE_URL + "/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, location }),
        });
        const result = await response.json();
        if (!response.ok)
            throw new Error(result.message || "Failed to register");
        handleLoginWithToast();
    }

    async function handleRegisterWithToast() {
        await toast.promise(
            postRegister(),
            {
                loading: "Registering new user...",
                success: "You have been registered successfully",
                error: "Failed to register - please try again",
            },
            {
                duration: 2000,
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
        <h1>Welcome to SKILLHUB</h1>
        <p>Share your skills or find someone who can help you</p>
    </div>
    <div class="auth-container">
        <div class="button-group">
            <button on:click={toggleLogin}>Login</button>
            <button on:click={toggleRegister}>Create Account</button>
        </div>
        {#if showLogin}
            <form
                on:submit|preventDefault={handleLoginWithToast}
                class="auth-form"
            >
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
                on:submit|preventDefault={handleRegisterWithToast}
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
        padding: 30px;
    }
    .auth-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
