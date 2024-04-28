<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let username = sessionStorage.getItem("username");

  onMount(() => {
    if (!username) {
      setTimeout(() => {
        navigate("/"); // Adjust as needed to point to your login page or home
      }, 3000);
    }
  });

  function handleLogout() {
    sessionStorage.clear();
    navigate("/");
  }
</script>

<main>
  <div>
    <h1>User: {username || "Not Available"}</h1>
    {#if !username}
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
