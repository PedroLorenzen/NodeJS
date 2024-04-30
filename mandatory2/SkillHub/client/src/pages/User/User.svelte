<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { navigate } from "svelte-routing";
  import toast, { Toaster } from "svelte-french-toast";
  import { user } from "../../stores/user.js";
  import { BASE_URL } from "../../stores/url.js";

  $user;

  let userid = $user.user.id;
  let username = $user.user.name;

  let error = "";
  let name, skill, description, price;
  let jobs = [];

  const skills = [
    "Painting",
    "IT-support",
    "Drywall",
    "Roofing",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Masonry",
    "Gardening",
    "Car repair",
    "Cleaning",
    "Cooking",
    "Childcare",
    "Petcare",
    "Tutoring",
    "Personal training",
  ];

  onMount(async () => {
    try {
      const jobResponse = await fetch($BASE_URL + "/api/jobs");
      toast.success(
        "Welcome to your user page. Here you can post a job or see your posted jobs",
        { duration: 5000, position: "top-right" },
      );

      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        jobs = jobData.data.filter((job) => job.user_id === $user.user.id);
      } else {
        console.error("Failed to fetch jobs:", await jobResponse.text());
      }
    } catch (error) {
      console.error("Error during job fetch operations:", error);
    }
  });

  /*
  $: if ($user) {
    console.log("Reactive User Details:", $user);
    console.log("User ID:", $user.user.id);
    console.log("User name:", $user.user.name);
    console.log("User email:", $user.user.email);
    console.log("User location:", $user.user.location);
  } else {
    console.log("User data is not yet available");
  }*/

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

  async function postJob() {
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, skill, description, price, userid }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to post job");
      }
      setTimeout(() => {
      location.reload();
    }, 2000);
  }

  async function handlePostJobWithToasts() {
    await toast.promise(
      postJob(),
      {
        loading: "Creating job...",
        success: "Job created succesfully. Refreshing page...",
        error: "Failed to create job - please check your input fields",
      },
      {
        duration: 2000,
      },
    );
  }
</script>

<Toaster />

<main>
  <div>
    <h1>User: {username || "Not Available"}</h1>
  </div>
  <div>
    <button on:click={handleLogout}>Logout</button>
  </div>
  <form on:submit|preventDefault={handlePostJobWithToasts}>
    <div>
      <h1>Here you can post a new job:</h1>
      <div>
        <label for="name">Name:</label>
        <input type="text" bind:value={name} id="name" required />

        <select bind:value={skill} id="skill" required>
          <option value="" disabled selected>Select a skill</option>
          {#each skills as skillOption}
            <option value={skillOption}>{skillOption}</option>
          {/each}
        </select>
        <label for="description">Description:</label>
        <input type="text" bind:value={description} id="description" required />

        <label for="price">Price:</label>
        <input type="number" bind:value={price} id="price" required />

        <label for="userid">User ID:</label>
        <input type="text" bind:value={userid} id="userid" required readonly />
        <p>
          <button type="submit">Post Job</button>
        </p>
      </div>
    </div>
  </form>
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
          </div>
          {#if jobs[index + 1]}
            <div class="job">
              <h2>{jobs[index + 1].name}</h2>
              <p>Skill: {jobs[index + 1].skill}</p>
              <p>Description: {jobs[index + 1].description}</p>
              <p>Price: ${jobs[index + 1].price}</p>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
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
    flex: 1 1 100%;
    display: flex;
    justify-content: space-between;
  }
  .job {
    flex: 1 1 48%;
    margin: 0 10px;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
</style>
