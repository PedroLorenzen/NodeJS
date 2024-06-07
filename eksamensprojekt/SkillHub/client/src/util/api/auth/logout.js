import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

async function logout() {
    const response = await fetch("http://localhost:8080/logout", {
        method: "GET",
        credentials: "include",
    });

    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    }
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to logout");
    }

    setTimeout(() => {
        navigate("/");
    }, 2000);
}

async function handleLogout() {
    await toast.promise(
        logout(),
        {
            loading: "Logging out...",
            success: "Logged out successfully. Redirecting...",
            error: "Failed to logout - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}

export default handleLogout;
