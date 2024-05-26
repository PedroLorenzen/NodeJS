<script>
    import { onMount } from "svelte";
    import { Toaster } from "svelte-french-toast";
    import { getSkills } from "../../util/api/skills/getSkills";
    import { getJobs } from "../../util/api/jobs/getJobs";
    import { getUsers } from "../../util/api/users/getUsers";

    let sortBy = "";
    let filterBy = "";
    let filterValue = "";
    let jobs = [];
    let sortedJobs = [];
    let allJobs = [];
    let skills = [];
    let locations = [];
    let users = [];

    onMount(async () => {
        try {
            skills = await getSkills();
        } catch (error) {
            console.error("Error during skill fetch operations:", error);
        }
        console.log("Fetched skills:", skills);

        try {
            users = await getUsers();
        } catch (error) {
            console.error("Error during user fetch operations:", error);
        }
        console.log("Fetched users:", users);

        try {
            jobs = await getJobs();
            jobs = jobs.map((job) => ({
                ...job,
                skill_name: skills.find((skill) => skill.id === job.skill_id)
                    .name,
                user_id: job.user,
                user_name: users.find((user) => user.id === job.user_id).name,
                location: users.find((user) => user.id === job.user_id)
                    .location,
            }));
            jobs = jobs.sort((a, b) =>
                a.skill_name.localeCompare(b.skill_name),
            );
            allJobs = jobs;
            filterLocations();
        } catch (error) {
            console.error("Error during job fetch operations:", error);
        }
    });

    function contactUser(user_id) {
        localStorage.setItem("contact_user_id", user_id);
        window.location.href = "/Chat";
    }

    function sortJobs() {
        filterBy = "";
        filterValue = "";
        if (sortBy === "skill_name") {
            jobs = allJobs;
            sortedJobs = jobs.sort((a, b) =>
                a.skill_name.localeCompare(b.skill_name),
            );
        } else if (sortBy === "location") {
            jobs = allJobs;
            sortedJobs = jobs.sort((a, b) =>
                a.location.localeCompare(b.location),
            );
        }
    }

    async function filterLocations() {
        jobs = allJobs;
        locations = [];
        for (let job of jobs) {
            if (!locations.includes(job.location)) {
                locations.push(job.location);
            }
        }
    }

    function filterJobs() {
        if (sortedJobs.length > 0) {
            jobs = sortedJobs;
            if (filterBy === "skill_name") {
                jobs = jobs.filter((job) => job.skill_name === filterValue);
                console.log("Filtered jobs:", jobs);
            } else if (filterBy === "location") {
                jobs = jobs.filter((job) => job.location === filterValue);
                console.log("Filtered jobs:", jobs);
            } else if (filterBy === "user") {
                jobs = jobs.filter((job) => job.user_name === filterValue);
                console.log("Filtered jobs:", jobs);
            }
        } else {
            jobs = allJobs;
            if (filterBy === "skill_name") {
                jobs = jobs.filter((job) => job.skill_name === filterValue);
                console.log("Filtered jobs:", jobs);
            } else if (filterBy === "location") {
                jobs = jobs.filter((job) => job.location === filterValue);
                console.log("Filtered jobs:", jobs);
            } else if (filterBy === "user") {
                jobs = jobs.filter((job) => job.user_name === filterValue);
                console.log("Filtered jobs:", jobs);
            }
        }
    }
</script>

<Toaster />

<main>
    <div>
        <h1>Welcome to SKILLHUB jobs</h1>
        <p>Find the job you need help with</p>
    </div>

    <div class="actions">
        <label for="filter_by">Filter by:</label>
        <select bind:value={filterBy} id="filter_by">
            <option value="" disabled selected>Filter by</option>
            <option value="skill_name">Skill Name</option>
            <option value="location">Location</option>
            <option value="user">User</option>
        </select>

        {#if filterBy === "skill_name"}
            <label for="skill_id">Skill:</label>
            <select
                bind:value={filterValue}
                on:change={filterJobs}
                id="skill_id"
            >
                <option value="" disabled selected>Select a skill</option>
                {#each skills as skill}
                    <option value={skill.name}>{skill.name}</option>
                {/each}
            </select>
        {/if}
        {#if filterBy === "location"}
            <label for="location">Location:</label>
            <select
                bind:value={filterValue}
                on:change={filterJobs}
                id="location"
            >
                <option value="" disabled selected>Select a location</option>
                {#each locations as location}
                    <option value={location}>{location}</option>
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
                    <option value={user.name}>{user.name}</option>
                {/each}
            </select>
        {/if}
        <label for="sort_by">Sort by:</label>
        <select bind:value={sortBy} on:change={sortJobs} id="sort_by">
            <option value="" disabled selected>Sort by</option>
            <option value="skill_name" selected>Skill Name</option>
            <option value="location">Location</option>
        </select>
    </div>

    {#if jobs.length > 0}
        <div class="jobs-container">
            {#each jobs as job, index (job.id)}
                {#if index % 2 === 0}
                    <div class="job-pair">
                        <div class="job">
                            <h2>{job.name}</h2>
                            <p>Skill: {job.skill_name}</p>
                            <p>Location: {job.location}</p>
                            <p>Description: {job.description}</p>
                            <p>Price: {job.price}</p>
                            <p>Name: {job.user_name}</p>
                            <button on:click={() => contactUser(job.user_id)}
                                >Contact User</button
                            >
                        </div>
                        {#if jobs[index + 1]}
                            <div class="job">
                                <h2>{jobs[index + 1].name}</h2>
                                <p>Skill: {jobs[index + 1].skill_name}</p>
                                <p>Location: {jobs[index + 1].location}</p>
                                <p>
                                    Description: {jobs[index + 1].description}
                                </p>
                                <p>Price: {jobs[index + 1].price}</p>
                                <p>Name: {jobs[index + 1].user_name}</p>
                                <button
                                    on:click={() =>
                                        contactUser(jobs[index + 1].user_id)}
                                    >Contact User</button
                                >
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</main>

<style>
    main {
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        background-color: white;
        width: 100%;
        padding: 0 30px 50px 30px;
        margin-top: 25px;
        margin-left: -30px;
        margin-right: 50px;
    }
    div {
        margin-bottom: 20px;
        background: white;
        padding-top: 20px;
        color: black;
        background: white;
        border-radius: 8px;
    }
    h1 {
        text-align: center;
        margin-bottom: 20px;
        color: black;
    }
    .jobs-container {
        display: flex;
        flex-wrap: wrap;
    }
    .job-pair {
        flex: 1 1 100%;
        display: flex;
        justify-content: space-between;
    }
    .job {
        flex: 1 1;
        background: lightgrey;
        margin: 0 40px;
        border: 1px solid #ccc;
        padding: 10px 30px 30px 50px;
        box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
        text-align: left;
    }
    .job p {
        margin: 5px;
        background-color: #ccc;
        border: 1px solid #ccc;
        padding: 5px 10px 5px 10px;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    .actions {
        background: lightgrey;
        margin: 10px;
        border: 1px solid #ccc;
        padding: 20px;
        box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .actions label {
        margin: 0 10px 0 30px;
    }
    .actions select {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
        font-size: medium;
    }

    button {
        background-color: #28a745;
        font-size: large;
        color: white;
        margin-top: 20px;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }
    button:hover {
        background-color: #218838;
    }
</style>
