<script>
    import { navigate } from "svelte-routing";

    let username = "";
    let password = "";
    let error = "";

    async function handleLogin() {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.message || "Failed to login");
            sessionStorage.setItem("username", username);
            navigate("/user");
        } catch (err) {
            error = err.message;
        }
    }

    async function handleRegister() {
        try {
            const response = await fetch(
                "http://localhost:8080/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                },
            );
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.message || "Failed to register");
            handleLogin();
        } catch (err) {
            error = err.message;
        }
    }
</script>

<form on:submit|preventDefault={handleRegister}>
    <div>
        <p>
            <label for="username-input">Username:</label>
            <input type="text" bind:value={username} />
        </p>
        <p>
            <label for="password-input">Password:</label>
            <input type="password" bind:value={password} />
        </p>
        <p>
            <button type="button" on:click={handleLogin}>Login</button>
            <button type="submit" on:click={handleRegister}>Signup</button>
            {#if error}
                <p style="color: red;">{error}</p>
            {/if}
        </p>
    </div>
</form>

<style>
    form {
        background-color: white;
        width: 100%;
        padding: 0 30px 0 30px;
        margin-top: 35px;
        margin-left: -30px;
        margin-right: 50px;
    }

    button {
        text-decoration: none;
        color: black;
        background-color: lightgreen;
        padding: 10px 20px;
        border-radius: 5px;
        margin: 10px;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: green;
    }

    div {
        margin-bottom: 20px;
        background: white;
        padding: 20px 0 40px 0;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: center;
        color: black;
    }
</style>
