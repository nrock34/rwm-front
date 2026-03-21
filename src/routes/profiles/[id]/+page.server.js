import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit'


export const load = async ({ fetch, params }) => {
    if (!env.API_URL || !env.ACS_TKN) {
        throw error(500, 'API_URL or ACS_TKN is not configured');
    }

    const profileUserId = params.id;

    let profileData;
    let recentPostsData;
    
    const fetchRecentPostsIdsResponse = await fetch(`${env.API_URL}authors/${profileUserId}/posts`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${env.ACS_TKN}`
        }
    })
    if (!fetchRecentPostsIdsResponse.ok) {
        throw error(fetchRecentPostsIdsResponse.status)
    } else {
        let data = await fetchRecentPostsIdsResponse.json()

        if (data.posts) {
            const profileRecentPosts = Promise.all((await data.posts.map(
                async (postId) => {
                    let fetchPostResponse = await fetch(`${env.API_URL}posts/${postId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${env.ACS_TKN}`
                        }
                    })
                    if (fetchPostResponse.ok) {
                        let postData = await fetchPostResponse.json()
                        return {'id': postId, 'data': postData}
                    } 
                    throw error(fetchPostResponse.status, 'Could not load recent posts.')
                }
            )))
            recentPostsData = await profileRecentPosts;
        }
    }



    const fetchProfileDataResponse = await fetch(`${env.API_URL}users/${profileUserId}/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${env.ACS_TKN}`
        }
    })
    if (!fetchProfileDataResponse.ok) {
        throw error(fetchProfileDataResponse.status, "Error retrieving profile")
    } else {
        let data = await fetchProfileDataResponse.json()
        let { 
            name, profile, location, username, major,
            badges, went_abroad, current_program_title, current_program_id,
            like_count, university, is_contributer, post_count
        } = data

        profileData = {
            id: profileUserId,
            name: name,
            avatar: profile.avatar,
            badge: 'Local Expert',
            location: location,
            university: university,
            currentProgram: current_program_title,
            major: major,
            year: 'Alumni',
            wentAbroad: went_abroad,
            joinDate: '2023-09-15',
            bio: profile.bio,
            isVerified: is_contributer,
            stats: {
                posts: post_count,
                followers: null,
                following: null,
                likes: like_count,
                helpfulVotes: null
            },
            badges: [
                { name: 'Local Expert', tone: 'blue' },
                { name: 'Top Contributor', tone: 'purple' },
                { name: 'Photography Pro', tone: 'green' }
            ],
            recentPosts: await recentPostsData,
        }
    }

    return { profileData }
}
