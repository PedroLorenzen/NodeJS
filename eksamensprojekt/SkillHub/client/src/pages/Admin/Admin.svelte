<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { sanitizeHTML } from "../../util/sanitize.js";
    import toast, { Toaster } from "svelte-french-toast";

    let users = [];
    let jobs = [];
    let skills = [];
    let allJobs = [];
    let filterBy = "";
    let filterValue = null;
    let skillName = "";

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

        try {
            const response = await fetch("http://localhost:8080/skills", {
                credentials: "include",
            });
            if (response.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (!response.ok) {
                throw new Error(
                    "Failed to fetch skills: " + (await response.text()),
                );
            }
            const skillData = await response.json();
            skills = skillData.map((skill) => ({
                ...skill,
                id: skill._id,
                name: skill.name,
            }));
        } catch (error) {
            console.error("Error fetching skills:", error);
            toast.error("Error fetching skills: " + error.message);
        }

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

            const jobData = await response.json();
            jobs = jobData.data.map((job) => ({
                ...job,
                id: job._id,
                user: job.user_id,
                name: job.name,
                skill: job.skill_id,
                description: job.description,
                price: job.price,
            }));
            console.log(jobs);
            jobs = jobs.sort((a, b) => a.user - b.user);
            allJobs = jobs;
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Error fetching jobs: " + error.message);
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

    async function putJob(job) {
        console.log(job);
        const response = await fetch(
            `http://localhost:8080/jobs?jobId=${job.id}`,
            {
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
            },
        );
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
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handlePutJob(job) {
        await toast.promise(
            putJob(job),
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

    async function deleteJob(job) {
        const response = await fetch(
            `http://localhost:8080/jobs?jobId=${job.id}`,
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
            throw new Error(result.error || "Failed to delete job");
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handleDeleteJob(job) {
        await toast.promise(
            deleteJob(job),
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

    async function putSkill(skill) {
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
                result.error ||
                    "The skill is missing some required information",
                {
                    duration: 3000,
                    position: "top-right",
                },
            );
            throw new Error(result.error || "Failed to update skill");
        } else if (!response.ok) {
            throw new Error(result.error || "Failed to update skill");
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handlePutSkill(skill) {
        await toast.promise(
            putSkill(skill),
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

    async function deleteSkill(skill) {
        const response = await fetch(
            `http://localhost:8080/skills?skillId=${skill.id}`,
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
            throw new Error(result.error || "Failed to delete skill");
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handleDeleteSkill(skill) {
        await toast.promise(
            deleteSkill(skill),
            {
                loading: "Deleting skill...",
                success: "Skill deleted successfully. Refreshing page...",
                error: "Failed to delete skill - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }

    function filterJobs() {
        jobs = allJobs;
        if (filterBy === "skill") {
            jobs = jobs.filter((job) => job.skill_id === parseInt(filterValue));
            console.log("Filtered jobs by skill:", jobs);
        } else if (filterBy === "user") {
            jobs = jobs.filter((job) => job.user_id === parseInt(filterValue));
            console.log("Filtered jobs by user:", jobs);
        }
    }

    function resetList() {
        jobs = allJobs;
        filterBy = "";
        filterValue = null;
    }

    async function postSkill() {
        const response = await fetch("http://localhost:8080/skills", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: sanitizeHTML(skillName),
            }),
        });
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
            throw new Error(result.error || "Failed to create skill");
        } else if (!response.ok) {
            throw new Error(result.error || "Failed to create skill");
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    async function handlePostSkill() {
        await toast.promise(
            postSkill(),
            {
                loading: "Creating skill...",
                success: "Skill created successfully. Refreshing page...",
                error: "Failed to create skill - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }

</script>

<Toaster />

<main>
    <div>
        <h1>Welcome to admins page</h1>
        <h2>Users</h2>
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
    <h2>Jobs</h2>
    <div class="actions">
        <label for="filter_by">Filter by:</label>
        <select bind:value={filterBy} id="filter_by">
            <option value="" disabled selected>Filter by</option>
            <option value="skill">Skill Name</option>
            <option value="user">User</option>
        </select>
        {#if filterBy === "skill"}
            <label for="skill_id">Skill:</label>
            <select
                bind:value={filterValue}
                on:change={filterJobs}
                id="skill_id"
            >
                <option value="" disabled selected>Select a skill</option>
                {#each skills as skill}
                    <option value={skill.id}>{skill.name}</option>
                {/each}
            </select>
        {/if}
        {#if filterBy === "user"}
            <label for="user_id">User:</label>
            <select
                bind:value={filterValue}
                on:change={filterJobs}
                id="user_id"
            >
                <option value="" disabled selected>Select a user</option>
                {#each users as user}
                    <option value={user.id}>{user.name}</option>
                {/each}
            </select>
        {/if}
        <button on:click={resetList}>Reset list</button>
    </div>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>price</th>
                    <th>Skill</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {#each jobs as job (job.id)}
                    <tr>
                        <td>
                            <select bind:value={job.user_id}>
                                {#each users as user (user._id)}
                                    <option value={user._id}>
                                        {user.name}
                                    </option>
                                {/each}
                            </select>
                        </td>
                        <td>
                            <input type="text" bind:value={job.name} />
                        </td>
                        <td>
                            <input type="text" bind:value={job.description} />
                        </td>
                        <td>
                            <input type="number" bind:value={job.price} />
                        </td>
                        <td>
                            <select bind:value={job.skill_id}>
                                {#each skills as skill (skill._id)}
                                    <option value={skill._id}>
                                        {skill.name}
                                    </option>
                                {/each}
                            </select>
                        </td>
                        <td>
                            <button on:click={() => handlePutJob(job)}
                                >Update</button
                            >
                        </td>
                        <td>
                            <button on:click={() => handleDeleteJob(job)}
                                >Delete</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <h2>Skills</h2>
    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="text" bind:value={skillName}  />
                    </td>
                    <td>
                        <button on:click={() => handlePostSkill()}
                            >Create</button
                        >
                    </td>
                </tr>
                {#each skills as skill (skill.id)}
                    <tr>
                        <td>
                            <input type="text" bind:value={skill.name} />
                        </td>
                        <td>
                            <button on:click={() => handlePutSkill(skill)}
                                >Update</button
                            >
                        </td>
                        <td>
                            <button on:click={() => handleDeleteSkill(skill)}
                                >Delete</button
                            >
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</main>

<style>
    main {
        background-color: white;
        width: 100%;
        padding: 10px 30px 50px 30px;
        margin-top: 25px;
        margin-left: -30px;
        margin-right: 50px;
    }
    h1 {
        text-align: center;
        color: black;
    }
    h2 {
        text-align: center;
        color: black;
    }
    .actions {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }
    .table-container {
        max-height: 60vh; /* Adjust the height as needed */
        overflow: auto;
        width: 95%;
        margin: 0 auto;
    }
    table {
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

    select {
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
    option {
        background-color: #ccc;
        color: black;
        border: 1px solid #ccc;
        padding: 5px 10px 5px 10px;
        box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
    }
    button {
        margin: 5px;
        font-size: 14px;
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
