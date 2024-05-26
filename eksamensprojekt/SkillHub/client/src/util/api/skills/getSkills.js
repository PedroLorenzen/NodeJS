import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getSkills( ) {
    try {
        const response = await fetch("http://localhost:8080/skills", {
            credentials: "include",
        });
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!response.ok) {
            throw new Error(
                "Failed to fetch skills: " + (await response.text()),
            );
        }
        const skillData = await response.json();
        return skillData.map((skill) => ({
            ...skill,
            id: skill._id,
            name: skill.name,
        }));
    } catch (error) {
        throw new Error("Error fetching skills: " + error.message);
    }
}

export async function handleGetSkills() {
    await toast.promise(
        getSkills(),
        {
            loading: "Fetching skills...",
            success: "Skills fetched successfully",
            error: "Failed to fetch skills - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}