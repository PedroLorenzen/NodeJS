import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize.js";

export async function postSkill(skillName, showToast) {
    const response = await fetch("http://localhost:8080/skills", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: sanitizeHTML(skillName),
        }),
    });
    const result = await response.json();
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    } else if (response.status === 400) {
        toast.error(
            result.error ||
            "The skill is missing some required information",
            {
                duration: 3000,
                position: "top-right",
            },
        );
        throw new Error(result.error || "Failed to create skill");
    } else if (!response.ok) {
        throw new Error(result.error || "Failed to create skill");
    }
    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handlePostSkill(skillName, showToast) {
    await toast.promise(
        postSkill(skillName, showToast),
        {
            loading: "Creating skill...",
            success: "Skill created successfully. Refreshing page...",
            error: "Failed to create skill - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}