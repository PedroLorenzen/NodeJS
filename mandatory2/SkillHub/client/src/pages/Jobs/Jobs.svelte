<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { Link } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";

    let jobs = [];

    onMount(async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/session/getuser",
                {
                    credentials: "include",
                },
            );
            const result = await response.json();
            if (!response.ok) {
                toast.error(
                    "You are not logged in... Redirecting back to the main page",
                    { duration: 2000 },
                );
                setTimeout(() => {
                    navigate("/");
                }, 2500);
            }

            toast.success(
                "Welcome " + result.user.name + ". Here you can find all jobs",
                { duration: 3000 },
            );

            const jobResponse = await fetch(`http://localhost:8080/api/jobs`);
            if (jobResponse.ok) {
                const jobData = await jobResponse.json();
                console.log("Received job data:", jobData);
                jobs = jobData.data;
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

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to logout");
            }
            navigate("/");
        } catch (err) {
            console.error("Logout Error:", err.message);
        }
    }
</script>

<Toaster />

<main>
    <div>
        <h1>Welcome to SKILLHUB jobs</h1>
        <p>Find the job you need help with</p>
        <button on:click={handleLogout}>Logout</button>
    </div>
    {#if jobs.length > 0}
        <h1>Here you have your posted jobs</h1>
        <div class="jobs-container">
            {#each jobs as job, index (job.id)}
                {#if index % 2 === 0}
                    <div class="job-pair">
                        <div class="job">
                            <h2>{job.name}</h2>
                            <p>Skill: {job.skill}</p>
                            <p>Description: {job.description}</p>
                            <p>Price: ${job.price}</p>
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
                                <p>Price: ${jobs[index + 1].price}</p>
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
        padding: 30px;
        margin-top: 35px;
    }
    main {
        background-color: white;
        width: 100%;
        padding: 0 30px 0 30px;
        margin-top: 35px;
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
        gap: 20px;
    }
    .job-pair {
        flex: 1 1 100%; /* Make sure each pair takes full width */
        display: flex;
        justify-content: space-between;
    }
    .job {
        flex: 1 1 48%; /* Adjust size to fit two jobs per row */
        margin: 0 10px;
        border: 1px solid #ccc;
        padding: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: left; /* Adjust text alignment as needed */
    }
</style>
