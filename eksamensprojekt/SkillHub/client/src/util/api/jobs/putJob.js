import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize.js";

export async function putJob(job, showToast) {
  const response = await fetch(`http://localhost:8080/jobs?jobId=${job.id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: job._id,
      user_id: job.user_id,
      name: sanitizeHTML(job.name),
      description: sanitizeHTML(job.description),
      location: sanitizeHTML(job.location),
      price: job.price,
      skill_id: job.skill_id,
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
    throw new Error(result.error || "Failed to update job");
  } else if (!response.ok) {
    throw new Error(result.error || "Failed to update job");
  }
  if (showToast) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

export async function handlePutJob(job, showToast) {
  await toast.promise(
    putJob(job, showToast),
    {
      loading: "Updating job...",
      success: "Job updated successfully. Refreshing page...",
      error: "Failed to update job - please try again",
    },
    {
      duration: 2000,
      position: "top-right",
    },
  );
}
