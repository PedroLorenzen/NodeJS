<script>
    import { navigate } from "svelte-routing";

    function goHome() {
        navigate("/");
    }
</script>

<div class="unauthorized-container">
    <div class="message">Oops! You are not authorized to view this page.</div>
    <button on:click={goHome}>Go Back to Homepage</button>
</div>

<style>
    .unauthorized-container {
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        display: flex;
        flex-direction: column;
        margin: 0 -30px 0 -30px;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background-color: #232323;
        color: white;
        text-align: center;
        font-family: "Arial", sans-serif;
    }

    .message {
        font-size: 2em;
        margin-bottom: 20px;
    }

    button {
        padding: 10px 20px;
        font-size: 1em;
        background-color: #ff4757;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #ff6b81;
    }
</style>
