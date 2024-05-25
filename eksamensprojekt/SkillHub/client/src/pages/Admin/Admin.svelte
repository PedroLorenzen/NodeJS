<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { sanitizeHTML } from "../../util/sanitize.js";
    import { toast } from "svelte-french-toast";

    let users = [];

    onMount(async () => {
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
            users = userData.data.map((user) => ({
                ...user,
                id: user._id,
                name: user.name,
                email: user.email,
                location: user.location,
                isAdmin: user.isAdmin,
            }));
        } catch (err) {
            console.error("Error during fetch operations:", err);
        }
    });

    async function putUser(user) {
        const response = await fetch(`http://localhost:8080/users?getUserId={user.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user.id,
                name: sanitizeHTML(user.name),
                email: sanitizeHTML(user.email),
                location: sanitizeHTML(user.location),
                isAdmin: user.isAdmin
            }),
        });
        const result = await response.json();
        if (response.status === 429) {
            navigate("/RateLimitExceeded");
            throw new Error("Rate limit exceeded");
        } else if (response.status === 400) {
            toast.error(
                result.error || "The user is missing some required information",
                {
                    duration: 3000,
                    position: "top-right",
                },
            );
            throw new Error(result.error || "Failed to update user");
        } else if (!response.ok) {
            throw new Error(result.error || "Failed to update user");
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handlePutUser(user) {
        await toast.promise(
            putUser(user),
            {
                loading: "Updating user...",
                success: "User updated successfully. Refreshing page...",
                error: "Failed to update user - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }
</script>

<main>
    <div>
        <h1>Admin</h1>
        <p>Admin page</p>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Admin</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each users as user (user.id)}
                    <tr>
                        <td><input type="text" bind:value={user.name} /></td>
                        <td><input type="email" bind:value={user.email} /></td>
                        <td><input type="text" bind:value={user.location} /></td>
                        <td>
                            <input type="checkbox" bind:checked={user.isAdmin} />
                        </td>
                        <td>
                            <button on:click={() => handlePutUser(user)}>Update</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</main>

<style>
    main {
        padding: 100px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
    }
    th {
        background-color: #f2f2f2;
        text-align: left;
    }
    button {
        padding: 5px 10px;
        cursor: pointer;
    }
</style>