<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { Link } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";

    let jobs = [];
    let skills = [];
    let users = [];
    let skillName = {};
    let userLocation = {};

    onMount(async () => {
        try {
            const skillsResponse = await fetch("http://localhost:8080/skills", {
                credentials: "include",
            });

            if (skillsResponse.ok) {
                const skillsData = await skillsResponse.json();
                skills = skillsData || [];
                skills.forEach((skill) => {
                    skillName[skill._id] = skill.name;
                });
                console.log("Fetched skills:", skills);
            } else if (skillsResponse.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else {
                console.error(
                    "Failed to fetch skills:",
                    await skillsResponse.text(),
                );
            }
        } catch (error) {
            console.error("Error during skill fetch operations:", error);
        }

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
                location: user.location,
            }));
            console.log("Fetched users:", users);
            users.forEach((user) => {
                userLocation[user._id] = user.location;
            });
            console.log("Fetched user locations:", userLocation);
        } catch (err) {
            console.error("Error during fetch operations:", err);
        }

        try {
            const jobResponse = await fetch("http://localhost:8080/jobs", {
                credentials: "include",
            });
            if (jobResponse.status === 429) {
                navigate("/RateLimitExceeded");
                throw new Error("Rate limit exceeded");
            } else if (!jobResponse.ok) {
                throw new Error(
                    "Failed to fetch jobs: " + (await jobResponse.text()),
                );
            }
            const jobData = await jobResponse.json();
            jobs = jobData.data.map((job) => ({
                ...job,
                id: job._id,
                name: job.name,
                skill_name: skillName[job.skill_id],
                description: job.description,
                price: job.price,
                user_id: job.user_id,
                location: userLocation[job.user_id],
            }));
        } catch (err) {
            console.error("Error during fetch operations:", err);
        }
    });
</script>

<Toaster />

<main>
    <div>
        <h1>Welcome to SKILLHUB jobs</h1>
        <p>Find the job you need help with</p>
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
                            <Link to="/Contact">
                                <button>Contact User</button>
                            </Link>
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
                                <Link to="/Contact">
                                    <button>Contact User</button>
                                </Link>
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
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        margin: 0 40px;
        border: 1px solid #ccc;
        padding: 10px 0 30px 50px;
        box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
        text-align: left;
    }
    .job p {
        margin: 5px;
    }

    button {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        transition: background-color 0.3s ease;
    }
    button:hover {
        background-color: #218838;
    }
</style>
