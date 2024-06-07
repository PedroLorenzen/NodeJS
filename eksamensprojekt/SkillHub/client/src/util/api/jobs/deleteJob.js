import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function deleteJob(job, showToast) {
    const response = await fetch(`http://localhost:8080/jobs?jobId=${job.id}`, {
        method: "DELETE",
        credentials: "include",
    });
    const result = await response.json();
    if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
    } else if (!response.ok) {
        throw new Error(result.error || "Failed to delete job");
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handleDeleteJob(job, showToast) {
    await toast.promise(
        deleteJob(job, showToast),
        {
            loading: "Deleting job...",
            success: "Job deleted successfully. Refreshing page...",
            error: "Failed to delete job - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
