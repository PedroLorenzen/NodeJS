import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getJobs(showToast) {
    try {
        const response = await fetch("http://localhost:8080/jobs", {
            credentials: "include",
        });
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!response.ok) {
            throw new Error("Failed to fetch jobs: " + (await response.text()));
        }

        const jobData = await response.json();
        const jobs = jobData.data.map((job) => ({
            ...job,
            id: job._id,
            user: job.user_id,
            name: job.name,
            skill: job.skill_id,
            description: job.description,
            price: job.price,
        }));

        if (showToast) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        return jobs;
    } catch (error) {
        throw new Error("Error fetching jobs: " + error.message);
    }
}

export async function handleGetJobs(showToast) {
    await toast.promise(
        getJobs(showToast),
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
