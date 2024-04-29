<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import toast, { Toaster } from "svelte-french-toast";

    let email;
    let subject;
    let message;

    onMount(async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/session/getuser",
                {
                    credentials: "include",
                },
            );
            const result = await response.json();
            if (!response.ok) {
                toast.error(
                    "You are not logged in... Redirecting back to the main page",
                    { duration: 2000 },
                );
                setTimeout(() => {
                    navigate("/");
                }, 2500);
            }

            toast.success(
                "Welcome " + result.user.name + ". Here you can send an email",
                { duration: 3000 },
            );

            email = "chri46nj@stud.kea.dk";
            subject = "What an amazing website";
            message = "Hi Christian here's your mandatory 2 feedback. It looks nice!";
        } catch (err) {
            console.error("Error during fetch operations:", err);
        }
    });

    async function postEmail() {
        const response = await fetch("http://localhost:8080/api/mails", {
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

<form on:submit|preventDefault={sendEmailWithToast}>
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
