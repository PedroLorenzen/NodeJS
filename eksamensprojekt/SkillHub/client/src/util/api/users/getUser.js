import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getUser(otherUserId, showToast) {
    try {
        const userResponse = await fetch(
            `http://localhost:8080/users?getUserById=${otherUserId}`,
            {
                credentials: "include",
            },
        );
        if (userResponse.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!userResponse.ok) {
            throw new Error(
                "Failed to fetch user: " + (await userResponse.text()),
            );
        }
        let user = await userResponse.json();
        return user;
    } catch (error) {
        throw new Error("Error fetching user: " + error);
    }
    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handleGetUser(otherUserId, showToast) {
    await toast.promise(
        getUser(otherUserId, showToast),
        {
            loading: "Fetching user...",
            success: "User fetched successfully",
            error: "Failed to fetch user - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
