<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { sanitizeHTML } from "../../util/sanitize.js";
    import toast, { Toaster } from "svelte-french-toast";
    import { getSkills } from "../../util/api/skills/getSkills.js";
    import { getUsers } from "../../util/api/users/getUsers.js";
    import { getJobs } from "../../util/api/jobs/getJobs.js";
    import { handlePutUser } from "../../util/api/users/putUser.js";
    import { handleDeleteUser } from "../../util/api/users/deleteUser.js";
    import { handlePutJob } from "../../util/api/jobs/putJob.js";
    import { handleDeleteJob } from "../../util/api/jobs/deleteJob.js";
    import { handlePutSkill } from "../../util/api/skills/putSkill.js";
    import { handleDeleteSkill } from "../../util/api/skills/deleteSkill.js";

    let users = [];
    let jobs = [];
    let skills = [];
    let allJobs = [];
    let filterBy = "";
    let filterValue = null;
    let skillName = "";

    onMount(async () => {
        try {
            users = await getUsers();
        } catch (error) {
            throw new Error("Failed to load users: " + error.message);
        }

        try {
            skills = await getSkills();
        } catch (error) {
            throw new Error("Failed to load skills: " + error.message);
        }

        try {
            jobs = await getJobs();
            jobs = jobs.sort((a, b) => a.user - b.user);
            allJobs = jobs;
        } catch (error) {
            throw new Error("Failed to load jobs: " + error.message);
        }
    });

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
                result.error ||
                    "The skill is missing some required information",
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
                                <button on:click={() => handlePutUser(user, true)}
                                    >Update</button
                                >
                            </td>
                            <td>
                                <button on:click={() => handleDeleteUser(user, true)}
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
                            <button on:click={() => handlePutJob(job, true)}
                                >Update</button
                            >
                        </td>
                        <td>
                            <button on:click={() => handleDeleteJob(job, true)}
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
                        <input type="text" bind:value={skillName} />
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
                            <button on:click={() => handlePutSkill(skill, true)}
                                >Update</button
                            >
                        </td>
                        <td>
                            <button on:click={() => handleDeleteSkill(skill, true)}
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
    td {
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #28a745;
    }
    td input, select, option, button {
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
    button {
        font-size: 14px;
    }
</style>
