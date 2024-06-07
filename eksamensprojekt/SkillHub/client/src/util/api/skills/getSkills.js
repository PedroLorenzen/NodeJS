import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getSkills(showToast) {
  try {
    const response = await fetch("http://localhost:8080/skills", {
      credentials: "include",
    });
    if (response.status === 429) {
      navigate("/RateLimitExceeded");
      throw new Error("Rate limit exceeded");
    } else if (!response.ok) {
      throw new Error("Failed to fetch skills: " + (await response.text()));
    }
    const skillData = await response.json();
    const skills = skillData.map((skill) => ({
      ...skill,
      id: skill._id,
      name: skill.name,
    }));

    if (showToast) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    return skills;
  } catch (error) {
    throw new Error("Error fetching skills: " + error.message);
  }
}

export async function handleGetSkills(showToast) {
  await toast.promise(
    getSkills(showToast),
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
