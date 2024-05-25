<script>
  import { navigate } from "svelte-routing";

  async function navigateTo(route) {
    try {
      const response = await fetch(`/${route}`, {
        credentials: "include",
      });

      if (response.ok) {
        navigate(`/${route}`);
      } else if (response.status === 429) {
        navigate("/RateLimitExceeded");
        throw new Error("Rate limit exceeded");
      }
    } catch (error) {
      throw new Error("Navigation error: " + error.message);
    }
  }
</script>

<header>
  <nav>
    <button on:click={() => navigateTo("")}>Home</button>
    <button on:click={() => navigateTo("User")}>Profile</button>
    <button on:click={() => navigateTo("Jobs")}>Jobs</button>
    <button on:click={() => navigateTo("Chats")}>Chats</button>
    <button on:click={() => navigateTo("Contact")}>Support</button>
    <button on:click={() => navigateTo("Admin")}>Admin</button>
  </nav>
</header>

<style>
  header {
    background-color: beige;
    padding: 10px;
    text-align: center;
    font-size: 17px;
    color: #333;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }

  button {
    background: none;
    border: none;
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  button:hover {
    color: white;
    background-color: #28a745;
  }
</style>
