<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import toast, { Toaster } from "svelte-french-toast";
  import { user } from "../../stores/user.js";
  import { BASE_URL } from "../../stores/url.js";
  import { sanitizeHTML } from "../../util/sanitize.js";

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
        {
          duration: 5000,
          position: "top-right",
        },
      );

      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        jobs = jobData.data.filter((job) => job.user_id === userid);
        jobs = jobs.map((job) => ({
          ...job,
          name: sanitizeHTML(job.name),
          skill: sanitizeHTML(job.skill),
          description: sanitizeHTML(job.description),
          price: job.price,
        }));
      } else if (jobResponse.status === 429) {
        navigate("/RateLimitExceeded");
      } else if (jobResponse.status === 400) {
        const errorData = await jobResponse.json();
        toast.error(
          errorData.error || "Price and User ID needs to be a number",
          {
            duration: 2000,
            position: "top-right",
          },
        );
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

  async function postLogout() {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 429) {
      navigate("/RateLimitExceeded");
      return;
    }
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to logout");
    }
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  async function handlePostLogoutWithToasts() {
    await toast.promise(
      postLogout(),
      {
        loading: "Logging out...",
        success: "Logged out succesfully. Redirecting...",
        error: "Failed to logout - please try again",
      },
      {
        duration: 2000,
        position: "top-right",
      },
    );
  }

  async function postJob() {
    const response = await fetch("http://localhost:8080/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sanitizeHTML(name),
        skill: sanitizeHTML(skill),
        description: sanitizeHTML(description),
        price: price,
        userid,
      }),
    });
    const result = await response.json();
    if (response.status === 429) {
      navigate("/RateLimitExceeded");
    } else if (!response.ok) {
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
        error: "Failed to create job - please try again",
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
    <h1>Welcome {username || "Not Available"}</h1>
    <button on:click={handlePostLogoutWithToasts} class="logout">Logout</button>
  </div>
  <div class="auth-container">
    <h2>Create a New Job</h2>
    <form on:submit|preventDefault={handlePostJobWithToasts} class="auth-form">
      <label for="name">Name:</label>
      <input type="text" bind:value={name} id="name" required />

      <label for="skill">Skill:</label>
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

      <button type="submit" class="submit-button">Create Job</button>
    </form>
  </div>
  <h1>Your Posted Jobs</h1>
  <div class="jobs-container">
    {#each jobs as job, index (job.id)}
      {#if index % 2 === 0}
        <div class="job-pair">
          <div class="job">
            <h2>{job.name}</h2>
            <p>Skill: {job.skill}</p>
            <p>Description: {job.description}</p>
            <p>Price: {job.price}</p>
          </div>
          {#if jobs[index + 1]}
            <div class="job">
              <h2>{jobs[index + 1].name}</h2>
              <p>Skill: {jobs[index + 1].skill}</p>
              <p>Description: {jobs[index + 1].description}</p>
              <p>Price: {jobs[index + 1].price}</p>
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
    padding: 20px 30px 0 30px;
    margin-left: -30px;
    margin-right: 50px;
  }
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: lightgrey;
    border-radius: 8px;
    box-shadow: 100px 50px 20px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 40px auto;
  }
  .auth-form {
    display: flex;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    color: white;
    flex-direction: column;
    width: 100%;
  }

  .auth-form label {
    margin-bottom: 5px;
    color: #333;
    text-align: left;
  }

  .auth-form input,
  select {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .auth-form select {
    cursor: pointer;
  }

  #userid {
    cursor: not-allowed;
  }

  .submit-button {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .submit-button:hover {
    background-color: #218838;
  }

  div {
    margin: 20px 0 20px 0;
    background: white;
    padding: 0 10px;
    border-radius: 8px;
    text-align: center;
    color: black;
  }
  h1 {
    text-align: center;
    margin-bottom: 40px;
    color: black;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
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
</style>
