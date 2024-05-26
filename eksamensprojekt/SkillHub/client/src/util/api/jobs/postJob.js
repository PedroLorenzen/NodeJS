import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize.js";

export async function postJob(name, skill_id, description, price, userId, showToast) {
    const response = await fetch("http://localhost:8080/jobs", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: sanitizeHTML(name),
            skill_id: skill_id,
            description: sanitizeHTML(description),
            price: price,
            user_id: userId,
        }),
    });
    const result = await response.json();
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    } else if (response.status === 400) {
        toast.error(
            result.error || "The job is missing some required information",
            {
                duration: 3000,
                position: "top-right",
            },
        );
        throw new Error(result.error || "Failed to post job");
    } else if (!response.ok) {
        throw new Error(result.error || "Failed to post job");
    }
    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handlePostJob(name, skill_id, description, price, userId, showToast) {
    await toast.promise(
        postJob(name, skill_id, description, price, userId, showToast),
        {
            loading: "Creating job...",
            success: "Job created successfully. Refreshing page...",
            error: "Failed to create job - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}