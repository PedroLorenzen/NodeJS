<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { sanitizeHTML } from "../../util/sanitize.js";
    import toast, { Toaster } from "svelte-french-toast";

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
        const response = await fetch(
            `http://localhost:8080/users?getUserId=${user.id}`,
            {
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
                    isAdmin: user.isAdmin,
                }),
            },
        );
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

    async function deleteUser(user) {
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
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handleDeleteUser(user) {
        await toast.promise(
            deleteUser(user),
            {
                loading: "Deleting user...",
                success: "User deleted successfully. Refreshing page...",
                error: "Failed to delete user - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }

    async function getJobs() {
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Error fetching jobs: " + error.message);
        }
    }
</script>

<Toaster />

<main>
    <div>
        <h1>Admin</h1>
        <p>Admin page</p>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Admin</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {#each users as user (user.id)}
                        <tr>
                            <td><input type="text" bind:value={user.name} /></td
                            >
                            <td
                                ><input
                                    type="email"
                                    bind:value={user.email}
                                /></td
                            >
                            <td
                                ><input
                                    type="text"
                                    bind:value={user.location}
                                /></td
                            >
                            <td>
                                <input
                                    type="checkbox"
                                    bind:checked={user.isAdmin}
                                />
                            </td>
                            <td>
                                <button on:click={() => handlePutUser(user)}
                                    >Update</button
                                >
                            </td>
                            <td>
                                <button on:click={() => handleDeleteUser(user)}
                                    >Delete</button
                                >
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</main>

<style>
    main {
        background-color: white;
        width: 100%;
        padding: 0 30px 50px 30px;
        margin-top: 25px;
        margin-left: -30px;
        margin-right: 50px;
    }
    .table-container {
        max-height: 60vh; /* Adjust the height as needed */
        overflow: auto;
        width: 80%;
        margin: 0 auto;
    }
    table {
        margin-bottom: 20px;
        padding: 20px;
        color: black;
        background-color: lightgray;
        border-radius: 8px;
        width: 100%;
    }
    td {
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #28a745;

    }
    td input {
        margin: 5px;
        background-color: #ccc;
        color: black;
        border: 1px solid #ccc;
        padding: 5px 10px 5px 10px;
        box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
    }
    th {
        background-color: #007bff;
        text-align: center;
        color: black;
        border: 1px solid #ccc;
        padding: 5px 10px;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
    }
    button {
        margin: 5px;
        background-color: #ccc;
        color: black;
        border: 1px solid #ccc;
        padding: 5px 10px 5px 10px;
        box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
    }
</style>
