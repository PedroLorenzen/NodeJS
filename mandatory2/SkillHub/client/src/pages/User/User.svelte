<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let username;
  let sessionUser = false;
  let error = "";

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
