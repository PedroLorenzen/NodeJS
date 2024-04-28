<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let username;
  let userid;
  let email;
  let city;
  let sessionUser = false;
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
      const response = await fetch("http://localhost:8080/session/getuser", {
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
      if (result.user) {
        username = result.user.name;
        userid = result.user.id;
        email = result.user.email;
        city = result.user.location;
        console.log("User ID:", userid, "Username:", username);
        sessionUser = true;
      }
      const jobResponse = await fetch(`http://localhost:8080/api/jobs`);
      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        jobs = jobData.data.filter((job) => job.user_id === userid);
      } else {
        console.error("Failed to fetch jobs:", await jobResponse.text());
      }
    } catch (err) {
      error = err.message;
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

  async function handlePostJob() {
    try {
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
      location.reload();
      alert("Job posted successfully");
    } catch (err) {
      error = err.message;
    }
  }
</script>

<main>
  <div>
    <h1>User: {username || "Not Available"}</h1>
    {#if !sessionUser}
      <p>You are not logged in... Redirecting back to the main page</p>
    {/if}
  </div>
  <div>
    <button on:click={handleLogout}>Logout</button>
  </div>
  <form on:submit|preventDefault={handlePostJob}>
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
