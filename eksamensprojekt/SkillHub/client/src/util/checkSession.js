import { user } from "../stores/user.js";
import { BASE_URL } from "../stores/url.js";

export async function checkSession() {
    let url = "http://localhost:8080/users";
    url += "?getUser=true";
    
    try {
        const response = await fetch(url, {
            credentials: "include",
        });
        if (response.ok) {
            const userData = await response.json();
            user.set(userData);
            return userData;
        }
        return null;
    } catch (error) {
        console.error("Error checking session:", error);
        return null;
    }
}

export default checkSession;
