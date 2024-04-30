<script>
    import { onMount } from "svelte";
    import toast, { Toaster } from "svelte-french-toast";
    import { BASE_URL } from "../../stores/url.js";

    let email;
    let subject;
    let message;

    onMount(async () => {
        toast.success(
                "Welcome. Here you can send an email",
                { duration: 3000, position: "top-right"}
            );
    });

    async function postEmail() {
        const response = await fetch($BASE_URL+"/api/mails", {
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
            } catch (e) {
                console.error("Error sending email: ", e);
            }
        } else {
            console.error("Failed to send email: ", await response.text());
        }
    }

    async function sendEmailWithToast() {
        await toast.promise(
            postEmail(),
            {
                loading: "Sending email...",
                success: "Email sent successfully",
                error: "Failed to send email",
            },
            {
                duration: 2000,
            },
        );
    }
</script>

<Toaster />

<form on:submit|preventDefault={sendEmailWithToast} class="auth-container">
    <div>
        <h2>Send Email</h2>
        <p>
            <label for="email">Email:</label>
            <input
                id="email"
                type="email"
                bind:value={email}
                placeholder="Enter recipient's email"
                required
            />
        </p>
        <p>
            <label for="subject">Subject:</label>
            <input
                id="subject"
                type="text"
                bind:value={subject}
                placeholder="Enter email subject"
                required
            />
        </p>
        <p>
            <label for="message">Message:</label>
            <textarea
                id="message"
                bind:value={message}
                placeholder="Enter your message"
                required
            ></textarea>
        </p>
        <button type="submit">Send Email</button>
    </div>
</form>

<style>
    div {
        margin: 20px;
        padding: 40px;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 50%;
        margin: 0 auto;
    }

    label {
        margin-top: 10px;
    }

    input,
    textarea {
        margin-top: 5px;
        padding: 5px;
        font-size: 16px;
    }

    textarea {
        height: 100px;
    }

    button {
        margin-top: 10px;
        padding: 5px;
        font-size: 16px;
        background-color: #333;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #555;
    }
</style>
