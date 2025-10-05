import { fetchGithubRepoAPi } from "../../../Api/GithubApi/githAuthApi";

export const fetchGithubRepoAction = ()=>async()=>{

    try {
        const token = localStorage.getItem("token")
        const response = await fetch(fetchGithubRepoAPi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any required headers, e.g., Authorization
                  'Authorization': `Bearer ${token}`
            },
        });
        // const data = await response;
        // dispatch({ type: 'FETCH_GITHUB_REPOS_SUCCESS', payload: data });
        console.log("GitHub repositories fetched successfully:", response);
    } catch (error) {
        // dispatch({ type: 'FETCH_GITHUB_REPOS_FAILURE', payload: error.message });
        console.error("Error fetching GitHub repositories:", error);
    }       
};