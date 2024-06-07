import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function putChat(otherUserId, newMessage, showToast) {
    try {
        const response = await fetch(
            `http://localhost:8080/chats?otherUserId=${otherUserId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
            },
        );
        const data = await response.json();
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!response.ok) {
            throw new Error("Failed to save message: " + data.message);
        }
    } catch (error) {
        throw new Error("Error saving message: " + error);
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handlePutChat(newMessage, otherUserId, showToast) {
    await toast.promise(
        putChat(newMessage, otherUserId, showToast),
        {
            loading: "Saving message...",
            success: "Message saved successfully. Refreshing page...",
            error: "Failed to save message - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
