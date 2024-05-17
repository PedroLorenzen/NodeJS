<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { Link } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";
    import { BASE_URL } from "../../stores/url.js";

    let jobs = [];

    onMount(async () => {
        try {
            const jobResponse = await fetch($BASE_URL + "/jobs", {
                credentials: "include",
            });
            if (jobResponse.ok) {
                const jobData = await jobResponse.json();
                console.log("Received job data:", jobData);
                jobs = jobData.data.map((job) => ({
                    ...job,
                    id: job._id,
                    name: job.name,
                    skill: job.skill,
                    description: job.description,
                    price: job.price,
                    user_id: job.user_id,
                }));
            } else if (jobResponse.status === 429) {
                navigate("/RateLimitExceeded");
            } else {
                console.error(
                    "Failed to fetch jobs:",
                    await jobResponse.text(),
                );
            }
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
                            <p>Skill: {job.skill}</p>
                            <p>Description: {job.description}</p>
                            <p>Price: {job.price}</p>
                            <Link to="/Contact">
                                <button>Contact User</button>
                            </Link>
                        </div>
                        {#if jobs[index + 1]}
                            <div class="job">
                                <h2>{jobs[index + 1].name}</h2>
                                <p>Skill: {jobs[index + 1].skill}</p>
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
        padding: 20px 0 40px 0;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: center;
        color: black;
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
