<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import toast, { Toaster } from "svelte-french-toast";
  import { user } from "../../stores/user.js";
  import { sanitizeHTML } from "../../util/sanitize.js";

  $user;

  let userid = $user.user._id;
  let username = $user.user.name;
  let email = $user.user.email;
  let location = $user.user.location;

  let oldPassword, newPassword, confirmPassword;

  let activeForm = "createJob";

  function switchForm(form) {
    activeForm = form;
  }

  let name, skill_id, description, price;

  let jobs = [];
  let skills = [];
  let skillName = {};

  onMount(async () => {
    let skillsUrl = "http://localhost:8080/skills";
    try {
      const skillsResponse = await fetch(skillsUrl, {
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
        console.error("Failed to fetch skills:", await skillsResponse.text());
      }
    } catch (error) {
      console.error("Error during skill fetch operations:", error);
    }

    let url = "http://localhost:8080/jobs?filterJobsByUser=true";

    try {
      const jobResponse = await fetch(url, {
        credentials: "include",
      });

      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        jobs = jobData.data.map((job) => ({
          ...job,
          id: job._id,
          name: sanitizeHTML(job.name),
          skill_name: skillName[job.skill_id],
          description: sanitizeHTML(job.description),
          price: job.price,
        }));
        console.log("Fetched jobs:", jobs); // Log fetched jobs
      } else if (jobResponse.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
      } else if (jobResponse.status === 400) {
        const errorData = await jobResponse.json();
        toast.error(errorData.error || "Server error", {
          duration: 2000,
          position: "top-right",
        });
      } else {
        console.error("Failed to fetch jobs:", await jobResponse.text());
      }
    } catch (error) {
      console.error("Error during job fetch operations:", error);
    }
  });

  async function postLogout() {
    const response = await fetch("http://localhost:8080/logout", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 429) {
      navigate("/RateLimitExceeded");
      throw new Error("Rate limit exceeded");
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

  async function handlePostLogout() {
    await toast.promise(
      postLogout(),
      {
        loading: "Logging out...",
        success: "Logged out successfully. Redirecting...",
        error: "Failed to logout - please try again",
      },
      {
        duration: 2000,
        position: "top-right",
      },
    );
  }

  async function postJob() {
    const response = await fetch("http://localhost:8080/jobs", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sanitizeHTML(name),
        skill_id: skill_id,
        description: sanitizeHTML(description),
        price: price,
        user_id: userid,
      }),
    });
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
      throw new Error(result.error || "Failed to post job");
    } else if (!response.ok) {
      throw new Error(result.error || "Failed to post job");
    }
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  async function handlePostJob() {
    await toast.promise(
      postJob(),
      {
        loading: "Creating job...",
        success: "Job created successfully. Refreshing page...",
        error: "Failed to create job - please try again",
      },
      {
        duration: 2000,
        position: "top-right",
      },
    );
  }

  async function putUser() {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match", {
        duration: 3000,
        position: "top-right",
      });
      throw new Error("New password and confirm password do not match");
    }
    const response = await fetch(`http://localhost:8080/users`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sanitizeHTML(username),
        email: sanitizeHTML(email),
        location: sanitizeHTML(location),
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
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

  async function handlePutUser() {
    await toast.promise(
      putUser(),
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
</script>

<Toaster />

<main>
  <div>
    <h1>Welcome {username || "Not Available"}</h1>
    <button on:click={handlePostLogout} class="logout">Logout</button>
  </div>
  <div class="container">
    <div class="formButtons">
      <button on:click={() => switchForm("createJob")} class="toggle-button"
        >Create Job</button
      >
      <button on:click={() => switchForm("editUser")} class="toggle-button"
        >Edit User</button
      >
    </div>

    {#if activeForm === "createJob"}
      <h2>Create a New Job</h2>
      <form on:submit|preventDefault={handlePostJob} class="form">
        <label for="name">Name:</label>
        <input type="text" bind:value={name} id="name" required />

        <label for="skill_id">Skill:</label>
        <select bind:value={skill_id} id="skill_id" required>
          <option value="" disabled selected>Select a skill</option>
          {#each skills as skill}
            <option value={skill._id}>{skill.name}</option>
          {/each}
        </select>

        <label for="description">Description:</label>
        <input type="text" bind:value={description} id="description" required />

        <label for="price">Price:</label>
        <input type="number" bind:value={price} id="price" required />

        <label for="userid">User ID:</label>
        <input type="text" bind:value={userid} id="userid" readonly />

        <button type="submit" class="submit-button">Create Job</button>
      </form>
    {/if}

    {#if activeForm === "editUser"}
      <h2>Edit User</h2>
      <form on:submit|preventDefault={handlePutUser} class="form">
        <label for="userid">User ID:</label>
        <input type="text" bind:value={userid} id="userid" readonly />

        <label for="username">Username:</label>
        <input type="text" bind:value={username} id="username" required />

        <label for="email">Email:</label>
        <input type="email" bind:value={email} id="email" required />

        <label for="location">Location:</label>
        <input type="text" bind:value={location} id="location" />

        <label for="oldPassword">Old Password:</label>
        <input type="password" bind:value={oldPassword} id="oldPassword" />

        <label for="newPassword">New Password:</label>
        <input type="password" bind:value={newPassword} id="newPassword" />

        <label for="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          bind:value={confirmPassword}
          id="confirmPassword"
        />

        <button type="submit" class="submit-button">Update User</button>
      </form>
    {/if}
  </div>
  <h1>Your Posted Jobs</h1>
  <div class="jobs-container">
    {#each jobs as job, index (job.id)}
      {#if index % 2 === 0}
        <div class="job-pair">
          <div class="job">
            <h2>{job.name}</h2>
            <p>Skill: {job.skill_name}</p>
            <p>Description: {job.description}</p>
            <p>Price: {job.price}</p>
          </div>
          {#if jobs[index + 1]}
            <div class="job">
              <h2>{jobs[index + 1].name}</h2>
              <p>Skill: {jobs[index + 1].skill_name}</p>
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
    padding: 20px 30px 50px 30px;
    margin-top: 25px;
    margin-left: -30px;
    margin-right: 50px;
  }
  .container {
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
  .form {
    display: flex;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    color: white;
    flex-direction: column;
    width: 100%;
  }

  .form label {
    margin-bottom: 5px;
    color: #333;
    text-align: left;
  }

  .form input,
  select {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form select {
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
  .formButtons {
    background-color: lightgrey;
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
