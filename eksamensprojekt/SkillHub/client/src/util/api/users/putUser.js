import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeEmail, sanitizeHTML } from "../../sanitize.js";

export async function putUser(user, showToast) {
    const response = await fetch(
        `http://localhost:8080/users?getUserId=${user.id}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user.id,
                name: sanitizeHTML(user.name),
                email: sanitizeEmail(user.email),
                location: sanitizeHTML(user.location),
                isAdmin: user.isAdmin,
            }),
        },
    );
    const result = await response.json();
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    } else if (response.status === 400) {
        toast.error(
            result.error || "The user is missing some required information",
            {
                duration: 3000,
                position: "top-right",
            },
        );
        throw new Error(result.error || "Failed to update user");
    } else if (!response.ok) {
        throw new Error(result.error || "Failed to update user");
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handlePutUser(user, showToast) {
    await toast.promise(
        putUser(user, showToast),
        {
            loading: "Updating user...",
            success: "User updated successfully. Refreshing page...",
            error: "Failed to update user - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}