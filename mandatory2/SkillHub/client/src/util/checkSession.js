import { user, userDetails } from "../stores/user.js";

export async function checkSession() {
    try {
        const response = await fetch("http://localhost:8080/session/getuser", {
            credentials: "include",
        });
        if (response.ok) {
            const userData = await response.json();
            user.set(userData);
            userDetails.set({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                location: userData.location,
            });
            return userData;
        }
        return null;
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

export default checkSession;
