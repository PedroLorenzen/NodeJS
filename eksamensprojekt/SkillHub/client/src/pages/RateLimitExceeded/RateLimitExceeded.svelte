<script>
    import { navigate } from "svelte-routing";

    function goHome() {
        navigate("/");
    }
</script>

<div class="ratelimit-container">
    <div class="message">
        Oops! You have exceeded the ratelimit for using this website please try
        again later.
    </div>
    <button on:click={goHome}>Go Back to Homepage</button>
</div>

<style>
    .ratelimit-container {
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        display: flex;
        margin: 0 -30px 0 -30px;
        flex-direction: column;
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
