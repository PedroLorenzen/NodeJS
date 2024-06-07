import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize.js";
import { sanitizeEmail } from "../../sanitize.js";
import handleLogin from "./login.js";

function login(email, password) {
    handleLogin(email, password);
}

async function register(email, password, name, location) {
    const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: sanitizeHTML(name),
            email: sanitizeEmail(email),
            password: sanitizeHTML(password),
            location: sanitizeHTML(location),
        }),
    });
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    }
    const result = await response.json();
    if (!response.ok) {
        if (response.status === 409) {
            toast.error(result.error || "User with this email already exists", {
                duration: 3000,
                position: "top-right",
            });
        } else if (response.status === 400) {
            toast.error(
                result.error ||
                    "Password must be between 6 and 70 characters long, include at least one uppercase letter, and one special character",
                {
                    duration: 3000,
                    position: "top-right",
                },
            );
        }
        throw new Error(result.message || "Failed to register");
    }
    login(email, password);
}

async function handleRegister(email, password, name, location) {
    await toast.promise(
        register(email, password, name, location),
        {
            loading: "Registering new user...",
            success: "You have been registered successfully...",
            error: "Failed to register - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}

export default handleRegister;
