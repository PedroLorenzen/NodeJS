import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function deleteSkill(skill, showToast) {
    const response = await fetch(
        `http://localhost:8080/skills?skillId=${skill.id}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );
    const result = await response.json();
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    } else if (!response.ok) {
        toast.error(result.error || "Failed to delete skill, check if there are jobs linked to the skill and try again", {
            duration: 3000,
            position: "top-right",
        });
        throw new Error(result.error || "Failed to delete skill, check if there are jobs linked to the skill and try again");
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handleDeleteSkill(skill, showToast) {
    await toast.promise(
        deleteSkill(skill, showToast),
        {
            loading: "Deleting skill...",
            success: "Skill deleted successfully. Refreshing page...",
            error: "Failed to delete skill - please try again - maybe there are still associated jobs?",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}