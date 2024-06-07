import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function deleteUser(user, showToast) {
    const response = await fetch(
        `http://localhost:8080/users?getUserId=${user.id}`,
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
        throw new Error(result.error || "Failed to delete user");
    }

    if (showToast) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

export async function handleDeleteUser(
    user,
    adminOverride,
    emailToDelete,
    email,
    showToast,
) {
    if (!adminOverride) {
        if (emailToDelete !== email) {
            toast.error(
                "Please enter your email to delete your user Profile and all associated jobs",
                {
                    duration: 3000,
                    position: "top-right",
                },
            );
            throw new Error("Email does not match");
        }
    }
    await toast.promise(
        deleteUser(user, showToast),
        {
            loading: "Deleting user...",
            success: "User deleted successfully. Redirecting...",
            error: "Failed to delete user - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
