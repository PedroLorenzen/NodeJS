<script>
    import { navigate } from 'svelte-routing';

    let username = '';
    let password = '';
    let error = '';
  
    async function handleLogin() {
      try {
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to login');
        sessionStorage.setItem('username', username);
        navigate('/user');
      } catch (err) {
        error = err.message;
      }
    }
  
    async function handleRegister() {
      try {
        const response = await fetch('http://localhost:8080/auth/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to register');
        handleLogin(); 
      } catch (err) {
        error = err.message;
      }
    }
  </script>
  
  <form on:submit|preventDefault={handleRegister}>
    <div>
    <label for="username-input">Username:</label>
      <input type="text" bind:value={username} />
    </div>
    <div>
    <label for="password-input">Password:</label>
      <input type="password" bind:value={password} />
    </div>
    <button type="button" on:click={handleLogin}>Login</button>
    <button type="submit" on:click="{handleRegister}">Signup</button>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  </form>
  