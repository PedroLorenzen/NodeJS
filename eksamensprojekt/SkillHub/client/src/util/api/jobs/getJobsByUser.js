import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize";

export async function getJobsByUser(skills, jobs, showToast) {
    try {
        const jobResponse = await fetch(
            "http://localhost:8080/jobs?filterJobsByUser=true",
            {
                credentials: "include",
            },
        );

        if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            jobs = jobData.data.map((job) => ({
                ...job,
                id: job._id,
                name: sanitizeHTML(job.name),
                skill_name: skills.find((skill) => skill.id === job.skill_id)
                    .name,
                description: sanitizeHTML(job.description),
                price: job.price,
            }));
        } else if (jobResponse.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (jobResponse.status === 400) {
            const errorData = await jobResponse.json();
            toast.error(errorData.error || "Server error", {
                duration: 2000,
                position: "top-right",
            });
        } else {
            throw new Error("Failed to fetch jobs" + jobResponse.status);
        }
    } catch (error) {
        throw new Error(
            "Failed to fetch jobs - please try again: " + error.message,
        );
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    return jobs;
}

export async function handleGetSkillsByUser(skills, jobs, showToast) {
    await toast.promise(
        getJobsByUser(skills, jobs, showToast),
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
