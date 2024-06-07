<script>
    import { Toaster } from "svelte-french-toast";
    import handleLogin from "../../util/api/auth/login.js";
    import handleRegister from "../../util/api/auth/register.js";

    let showLogin = true;
    let showRegister = false;
    let email = "";
    let password = "";
    let name = "";
    let location = "";

    function login() {
        handleLogin(email, password);
    }

    function register() {
        handleRegister(email, password, name, location);
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
    <div class="container">
        <div class="button-group">
            <button on:click={toggleLogin}>Login</button>
            <button on:click={toggleRegister}>Create Account</button>
        </div>
        {#if showLogin}
            <form on:submit|preventDefault={login} class="form">
                <label for="email">Email:</label>
                <input
                    type="email"
                    bind:value={email}
                    id="email"
                    placeholder="dummy: chris@johnson.dk"
                    required
                />

                <label for="password">Password:</label>
                <input
                    type="password"
                    bind:value={password}
                    id="password"
                    placeholder="dummy: 123"
                    required
                />

                <button type="submit" class="submit-button">Login</button>
            </form>
        {/if}
        {#if showRegister}
            <form on:submit|preventDefault={register} class="form">
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
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        background-color: white;
        width: 100%;
        padding: 10px 30px 50px 30px;
        margin-top: 25px;
        margin-left: -30px;
        margin-right: 50px;
    }
    .text {
        text-align: center;
        color: black;
    }
    .container {
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

    .form {
        display: flex;
        color: white;
        flex-direction: column;
        width: 100%;
    }

    .form label {
        margin-bottom: 5px;
        color: #333;
        text-align: left;
    }

    .form input {
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
