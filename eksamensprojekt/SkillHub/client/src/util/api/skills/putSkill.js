import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";
import { sanitizeHTML } from "../../sanitize.js";

export async function putSkill(skill, showToast) {
  const response = await fetch(
    `http://localhost:8080/skills?skillId=${skill.id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: skill.id,
        name: sanitizeHTML(skill.name),
      }),
    },
  );
  const result = await response.json();
  if (response.status === 429) {
    navigate("/RateLimitExceeded");
    throw new Error("Rate limit exceeded");
  } else if (response.status === 400) {
    toast.error(
      result.error || "The skill is missing some required information",
      {
        duration: 3000,
        position: "top-right",
      },
    );
    throw new Error(result.error || "Failed to update skill");
  } else if (!response.ok) {
    throw new Error(result.error || "Failed to update skill");
  }
  if (showToast) {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

export async function handlePutSkill(skill, showToast) {
  await toast.promise(
    putSkill(skill, showToast),
    {
      loading: "Updating skill...",
      success: "Skill updated successfully. Refreshing page...",
      error: "Failed to update skill - please try again",
    },
    {
      duration: 2000,
      position: "top-right",
    },
  );
}
