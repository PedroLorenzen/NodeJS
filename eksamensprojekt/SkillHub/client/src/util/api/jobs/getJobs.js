import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getJobs() {
    try {
        const response = await fetch("http://localhost:8080/jobs", {
            credentials: "include",
        });
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!response.ok) {
            throw new Error(
                "Failed to fetch jobs: " + (await response.text()),
            );
        }

        const jobData = await response.json();
        return jobData.data.map((job) => ({
            ...job,
            id: job._id,
            user: job.user_id,
            name: job.name,
            skill: job.skill_id,
            description: job.description,
            price: job.price,
        }));        
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

export async function handleGetJobs() {
    await toast.promise(
        getJobs(),
        {
            loading: "Fetching jobs...",
            success: "Jobs fetched successfully",
            error: "Failed to fetch jobs - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}