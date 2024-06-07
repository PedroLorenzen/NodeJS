import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function handleChat(otherUserId, messages, showToast) {
    try {
        const response = await fetch(
            `http://localhost:8080/chats?otherUserId=${otherUserId}`,
            {
                credentials: "include",
            },
        );
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (response.status === 404) {
            toast.error("No chat exists, creating new chat...");
            const newChatResponse = await fetch(
                `http://localhost:8080/chats?otherUserId=${otherUserId}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );
            if (newChatResponse.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (!newChatResponse.ok) {
                throw new Error(
                    "Failed to create new chat: " + newChatResponse.text(),
                );
            }
            window.location.reload();
        }
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Failed to fetch chat history: " + data.message);
        }
        messages = data.chat || [];
        return messages;
    } catch (error) {
        throw new Error("Error fetching chat history: " + error);
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handleHandleChat(otherUserId, messages, showToast) {
    await toast.promise(
        handleChat(otherUserId, messages, showToast),
        {
            loading: "Fetching chat history...",
            success: "Chat history fetched successfully",
            error: "Failed to fetch chat history - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
