<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";
    import { BASE_URL } from "../../stores/url.js";

    let email = "chri46nj@stud.kea.dk";
    let subject;
    let message;

    onMount(async () => {
        toast.success("Welcome. Here you can send an email", {
            duration: 3000,
            position: "top-right",
        });
    });

    async function postEmail() {
        const response = await fetch($BASE_URL + "/api/mails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: email,
                subject: subject,
                message: message,
            }),
        });
        if (response.ok) {
            try {
                const data = await response.json();
                console.log("Email sent successfully: ", data);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } catch (e) {
                console.error("Error sending email: ", e);
            }
        } else if (response.status === 429) {
            navigate("/RateLimitExceeded");
        } else {
            console.error("Failed to send email: ", await response.text());
        }
    }

    async function handlePostEmail() {
        await toast.promise(
            postEmail(),
            {
                loading: "Sending email...",
                success: "Email sent successfully",
                error: "Failed to send email - please try again",
            },
            {
                duration: 2000,
                position: "top-right",
            },
        );
    }
</script>

<Toaster />

<main>
    <div class="auth-container">
        <form on:submit|preventDefault={handlePostEmail} class="auth-form">
            <h2>Send Email</h2>

            <label for="email">Email:</label>
            <input
                id="email"
                type="email"
                bind:value={email}
                placeholder="Enter recipient's email"
                required
                readonly
            />

            <label for="subject">Subject:</label>
            <input
                id="subject"
                type="text"
                bind:value={subject}
                placeholder="Enter email subject"
                required
            />

            <label for="message">Message:</label>
            <textarea
                id="message"
                bind:value={message}
                placeholder="Enter your message"
                required
            ></textarea>

            <button type="submit" class="submit-button">Send Email</button>
        </form>
    </div>
</main>

<style>
    main {
        background-color: white;
        width: 100%;
        padding: 50px 30px 50px 30px;
        margin-left: -30px;
        margin-right: 50px;
    }

    h2 {
        text-align: center;
        color: black;
    }
    .auth-container {
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
    .auth-form {
        display: flex;
        font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
            "Lucida Sans", Arial, sans-serif;
        color: white;
        flex-direction: column;
        width: 100%;
    }

    .auth-form label {
        margin-bottom: 5px;
        font-family: Georgia, "Times New Roman", Times, serif;
        color: #333;
        text-align: left;
    }

    .auth-form input {
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    #email {
        cursor: not-allowed;
    }

    .auth-form textarea {
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        height: 70px;
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
</style>
