import { navigate } from "svelte-routing";
import toast from "svelte-french-toast";

export async function getUsers(showToast) {
    try {
        const userResponse = await fetch("http://localhost:8080/users", {
            credentials: "include",
        });
        if (userResponse.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (!userResponse.ok) {
            throw new Error(
                "Failed to fetch users: " + (await userResponse.text()),
            );
        }
        const userData = await userResponse.json();
        const users = userData.data.map((user) => ({
            ...user,
            id: user._id,
            name: user.name,
            email: user.email,
            location: user.location,
            isAdmin: user.isAdmin,
        }));

        if (showToast) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        return users;
    } catch (err) {
        throw new Error("Error fetching users: " + err.message);
    }
}

export async function handleGetUsers(showToast) {
    await toast.promise(
        getUsers(showToast),
        {
            loading: "Fetching users...",
            success: "Users fetched successfully",
            error: "Failed to fetch users - please try again",
        },
        {
            duration: 2000,
            position: "top-right",
        },
    );
}
