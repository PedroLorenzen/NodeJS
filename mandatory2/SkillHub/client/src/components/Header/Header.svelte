<script>
    import { navigate } from "svelte-routing";
  
    async function navigateTo(route) {
      try {
        const response = await fetch(`/${route}`);
  
        if (response.ok) {
          navigate(`/${route}`);
        } else if (response.status === 429) {
          navigate('/RateLimitExceeded');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  </script>

  
  <header>
    <nav>
      <button on:click={() => navigateTo('')}>Home</button>
      <button on:click={() => navigateTo('User')}>User</button>
      <button on:click={() => navigateTo('Jobs')}>Jobs</button>
      <button on:click={() => navigateTo('Contact')}>Contact</button>
    </nav>
  </header>  

<style>
    header {
        background-color: beige;
        padding: 20px;
        text-align: center;
        font-size: 20px;
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
