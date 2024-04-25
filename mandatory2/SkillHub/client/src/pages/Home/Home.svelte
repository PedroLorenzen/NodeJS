<script>
    import { Link } from 'svelte-routing';
</script>

<main>
    <div>
        <h1>Welcome to SKILLHUB</h1>
        <p>Share your skills or find someone who can help you</p>
    </div>
    <div>
        <h2>How it works</h2>
        <p>1. Create an account</p>
        <p>2. Share your skills or search for a skill you need</p>
    </div>
    <div>
        <span><Link to="/login">Login / Create Account</Link></span>
        <span><Link to="/jobs">Jobs</Link></span>
    </div>
    <div>
        <h2>New jobs</h2>
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

    span {
        text-decoration: none;
        color: black;
        background-color: lightgreen;
        padding: 10px 20px;
        border-radius: 5px;
        margin: 10px;
        transition: background-color 0.3s;
    }

    span:hover {
        background-color: green;
    }

    div {
        margin-bottom: 20px;
        background: white;
        padding: 20px 0 40px 0;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        text-align: center;
        color: black;
    }
</style>
