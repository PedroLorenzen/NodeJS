<script>
  import { onMount } from "svelte";
  import { Toaster } from "svelte-french-toast";
  import { user } from "../../stores/user.js";
  import logout from "../../util/api/auth/logout.js";
  import { getSkills } from "../../util/api/skills/getSkills.js";
  import { getJobsByUser } from "../../util/api/jobs/getJobsByUser.js";
  import { handlePostJob } from "../../util/api/jobs/postJob.js";
  import { handlePutJob } from "../../util/api/jobs/putJob.js";
  import { handlePutUser } from "../../util/api/users/putUser.js";
  import { handleDeleteUser } from "../../util/api/users/deleteUser.js";
  import { handleDeleteJob } from "../../util/api/jobs/deleteJob.js";

  $user;

  let userId = $user.user._id;
  let username = $user.user.name;
  let email = $user.user.email;
  let location = $user.user.location;

  let handleUser = {
    id: userId,
    name: username,
    email: email,
    location: location
  };

  let activeForm = "createJob";

  function switchForm(form) {
    activeForm = form;
  }

  let oldPassword, newPassword, confirmPassword;

  let emailToDelete;

  let jobId, name, skill_id, description = "", price = null;

  function editJobForm(job) {
    jobId = job.id;
    name = job.name;
    skill_id = job.skill_id;
    description = job.description;
    price = job.price;
  }

  function closeUpdateJob() {
    jobId = null;
  }

  let jobs = [];
  let skills = [];

  onMount(async () => {
    try {
      skills = await getSkills();
    } catch (error) {
      throw new Error("Failed to load skills: " + error.message);
    }

    try {
      jobs = await getJobsByUser(skills, jobs);
    } catch (error) {
      throw new Error("Failed to load jobs: " + error.message);
    }
  });
</script>

<Toaster />

<main>
  <div>
    <h1>Welcome {username || "Not Available"}</h1>
    <button on:click={logout} class="logout">Logout</button>
  </div>
  <div class="container">
    <div class="formButtons">
      <button on:click={() => switchForm("createJob")} class="toggle-button"
        >Create Job</button
      >
      <button on:click={() => switchForm("editUser")} class="toggle-button"
        >Update / Delete User</button
      >
    </div>

    {#if activeForm === "createJob"}
      <h2>Create a New Job</h2>
      <form
        on:submit|preventDefault={() =>
          handlePostJob(name, skill_id, description, price, userId, true)}
        class="form"
      >
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

        <label for="userId">User ID:</label>
        <input type="text" bind:value={userId} id="userId" readonly />

        <button type="submit" class="submit-button">Create Job</button>
      </form>
    {/if}

    {#if activeForm === "editUser"}
      <h2>Edit User</h2>
      <form on:submit|preventDefault={() => handlePutUser(handleUser, oldPassword, newPassword, true)} class="form">
        <label for="userId">User ID:</label>
        <input type="text" bind:value={handleUser.id} id="userId" readonly />

        <label for="username">Username:</label>
        <input type="text" bind:value={handleUser.name} id="username" required />

        <label for="email">Email:</label>
        <input type="email" bind:value={handleUser.email} id="email" required />

        <label for="location">Location:</label>
        <input type="text" bind:value={handleUser.location} id="location" required />

        <label for="oldPassword">Old Password:</label>
        <input type="password" bind:value={oldPassword} id="oldPassword" />

        <div id="passwordDiv">
          <label for="newPassword">New Password:</label>
          <input type="password" bind:value={newPassword} id="newPassword" />
          <label for="newPassword" class="passwordRequirements"
            >Password must be between 6 and 70 characters long, include at least
            one uppercase letter, one special character and not match the old
            password</label
          >
        </div>

        <label for="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          bind:value={confirmPassword}
          id="confirmPassword"
        />
        <button type="submit" class="submit-button">Update User</button>
        <button
          type="button"
          on:click={() => handleDeleteUser(handleUser, "", emailToDelete, email, true)}
          class="delete-user-button"
        >
          Delete User And Associated Jobs
        </button>
        <label for="userEmailToDelete">Confirm Delete User:</label>
        <input
          type="email"
          bind:value={emailToDelete}
          id="userEmailToDelete"
          placeholder="To delete user, type your email address"
        />
      </form>
    {/if}
  </div>
  <h1>Your Posted Jobs</h1>
  <div class="jobs-container">
    {#each jobs as job, index (job.id)}
      {#if job.id === jobId}
        <div class="edit-job-form">
          <h2>Edit Job</h2>
          <form
            on:submit|preventDefault={() => handlePutJob(job, true)}
            class="form"
          >
            <label for="jobName">Job Name:</label>
            <input type="text" bind:value={job.name} id="jobName" required />

            <select bind:value={job.skill_id} id="skill_id" required>
              <option value="" disabled selected>Select a skill</option>
              {#each skills as skill}
                <option value={skill._id}>{skill.name}</option>
              {/each}
            </select>

            <label for="jobDescription">Description:</label>
            <textarea bind:value={job.description} id="jobDescription" required />

            <label for="jobPrice">Price:</label>
            <input type="number" bind:value={job.price} id="jobPrice" required />

            <label for="jobUserId" hidden>User ID:</label>
            <input type="text" bind:value={job.userId} id="jobUserId" hidden />

            <div class="edit-job-buttons">
              <button type="submit" class="submit-button">Update Job</button>
              <button
                type="button"
                on:click={closeUpdateJob}
                class="cancel-button">Cancel</button
              >
            </div>
          </form>
        </div>
      {:else}
        <div class="job">
          <h2>{job.name}</h2>
          <p>Skill: {job.skill_name}</p>
          <p>Description: {job.description}</p>
          <p>Price: {job.price}</p>
          <button on:click={() => editJobForm(job)}>Edit</button>
          <button
            type="button"
            on:click={() => handleDeleteJob(job, true)}
            class="delete-job-button"
          >
            Delete
          </button>
        </div>
      {/if}
    {/each}
  </div>
</main>

<style>
  main {
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
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

  #passwordDiv {
    display: flex;
    margin: 0 -10px 15px -10px;
    flex-direction: column;
    background-color: lightgrey;
  }

  .passwordRequirements {
    margin: -15px 10px 0 10px;
    font-size: 11px;
    font-weight: bold;
  }

  #userId {
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

  .delete-job-button, .delete-user-button {
    background-color: #dc3545;
    color: white;
    padding: 10px 20px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .delete-user-button {
    margin: 50px 0 15px 0;
  }  

  .delete-job-button:hover, .delete-user-button:hover {
    background-color: darkred;
  }

  div {
    background: white;
    padding: 0 10px;
    border-radius: 8px;
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
    flex-direction: column;
  }
  .job {
    background: lightgrey;
    margin: 10px 100px 10px 100px;
    border: 1px solid #ccc;
    padding: 10px 0 30px 50px;
    box-shadow: 20px 20px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
  }
  .job p {
    margin: 5px 100px 5px 5px;
    background-color: #ccc;
    border: 1px solid #ccc;
    padding: 5px 10px 5px 10px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  .edit-job-form {
    display: flex;
    flex-direction: column;
    background: lightgrey;
    border-radius: 8px;
    box-shadow: 100px 50px 20px rgba(0, 0, 0, 0.1);
    width: 450px;
    padding: 40px;
    margin: 40px auto;
    color: white;
  }
  .edit-job-form h2 {
    color: black;
  }

  textarea {
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .edit-job-buttons {
    display: flex;
    justify-content: center;
    flex-direction: row;
    background-color: lightgrey;
  }
</style>
