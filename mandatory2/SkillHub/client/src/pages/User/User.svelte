<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let username;
  let userID;
  let email;
  let city;
  let sessionUser = false;
  let error = "";
  let name, skill, description, price;

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
        }, 2000);
        throw new Error(result.message || "No session found");
      }
      username = result.user;
      console.log(result);
      console.log(result.user);
      sessionUser = true;
    } catch (err) {
      error = err.message;
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
        body: JSON.stringify({ name, skill, description, price, userID }),
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
      <p>{error}</p>
      <p>Here you can post a new job:</p>
      <p>
        <label for="name">Name:</label>
        <input type="text" bind:value={name} id="name" required />

        <select bind:value={skill} id="skill" required>
          <option value="" disabled selected>Select a skill</option>
          {#each skills as skillOption}
            <option value={skillOption}>{skillOption}</option>
          {/each}
        </select>
      </p>
      <p>
        <label for="description">Description:</label>
        <input type="text" bind:value={description} id="description" required />

        <label for="price">Price:</label>
        <input type="number" bind:value={price} id="price" required />
      </p>
      <p>
        <button type="submit">Post Job</button>
      </p>
    </div>
  </form>
</main>

<style>
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
</style>
