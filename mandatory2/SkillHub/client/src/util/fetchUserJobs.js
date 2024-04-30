
async function fetchUserJobs(userId) {
    try {
        const jobResponse = await fetch(`http://localhost:8080/api/jobs`);
        if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            return jobData.data.filter((job) => job.user_id === userId);
        } else {
            console.error("Failed to fetch jobs:", await jobResponse.text());
            return [];
        }
    } catch (error) {
        console.error("Error during job fetch operations:", error);
        return [];
    }
}

export default fetchUserJobs;