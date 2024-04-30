<script>
    import { Link } from "svelte-routing";
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";

    let showLogin = true;
    let showRegister = false; // Controls visibility of the registration form
    let email = "";
    let password = "";
    let name = "";
    let location = "";

    async function postLogin() {
        const response = await fetch("http://localhost:8080/auth/login", {
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
            }
        );
    }

    async function postRegister() {
        const response = await fetch("http://localhost:8080/api/users", {
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
            }
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
    <div>
        <button on:click={toggleLogin}>Login</button>
        <button on:click={toggleRegister}>Create Account</button>
        <span><Link to="/Jobs">Jobs</Link></span>
        {#if showLogin}
            <form on:submit|preventDefault={postLogin}>
                <div>
                    <p>
                        <label for="email">Email:</label>
                        <input
                            type="email"
                            bind:value={email}
                            id="email"
                            required
                        />
                        <label for="password">Password:</label>
                        <input
                            type="password"
                            bind:value={password}
                            id="password"
                            required
                        />
                    </p>
                    <p>
                        <button type="submit">Login</button>
                    </p>
                </div>
            </form>
        {/if}
        {#if showRegister}
            <form on:submit|preventDefault={handleRegisterWithToast}>
                <div>
                    <p>
                        <label for="name">Name:</label>
                        <input
                            type="text"
                            bind:value={name}
                            id="name"
                            required
                        />
                        <label for="email">Email:</label>
                        <input
                            type="email"
                            bind:value={email}
                            id="email"
                            required
                        />
                    </p>
                    <p>
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
                    </p>
                    <p>
                        <button type="submit">Signup</button>
                    </p>
                </div>
            </form>
        {/if}
    </div>
</main>

<style>
    main {
        background-color: white;
        width: 100%;
        padding: 0 30px 0 30px;
        margin-top: 35px;
        margin-left: -30px;
        margin-right: 50px;
    }

    span {
        text-decoration: none;
        color: black;
        background-color: lightgreen;
        padding: 10px 20px;
        border-radius: 5px;
        margin: 10px;
        transition: background-color 0.3s;
    }

    span:hover {
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
