import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeEmail } from "../../sanitize.js";

async function login(email, password) {
    const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: sanitizeEmail(email),
            password: password,
        }),
    });
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    }
    const result = await response.json();
    if (response.status === 404) {
        toast.error(
            result.error || "Invalid email",
            {
                duration: 3000,
                position: "top-right",
            },
        );
        throw new Error(result.message || "Invalid email");
    } else if (response.status === 401) {
        toast.error(
            result.error || "Invalid password",
            {
                duration: 3000,
                position: "top-right",
            },
        );
        throw new Error(result.message || "Invalid password");
    } else if (!response.ok) {
        throw new Error(result.message || "Failed to login");
    }
    setTimeout(() => {
        navigate("/User");
    }, 2000);
}

async function handleLogin(email, password) {
    await toast.promise(
        login(email, password),
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

export default handleLogin;