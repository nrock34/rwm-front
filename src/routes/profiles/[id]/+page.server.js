import { API_URL, ACS_TKN } from '$env/static/private';
import { error } from '@sveltejs/kit'

console.log(API_URL)


export const load = async ({ fetch, params }) => {
    const profileUserId = params.id;

    let profileData;
    let recentPostsData;
    
    const fetchRecentPostsIdsResponse = await fetch(`${API_URL}authors/${profileUserId}/posts`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${ACS_TKN}`
        }
    })
    if (!fetchRecentPostsIdsResponse.ok) {
        console.log('ERROR')
        error(fetchRecentPostsIdsResponse.status)
    } else {
        let data = await fetchRecentPostsIdsResponse.json()
        console.log(data)

        if (data.posts) {
            const profileRecentPosts = Promise.all((await data.posts.map(
                async (postId) => {
                    let fetchPostResponse = await fetch(`${API_URL}posts/${postId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${ACS_TKN}`
                        }
                    })
                    if (fetchPostResponse.ok) {
                        let postData = await fetchPostResponse.json()
                        return {'id': postId, 'data': postData}
                    } 
                    error(fetchPostResponse.status, 'Could not load recent posts.')
                }
            )))
            recentPostsData = await profileRecentPosts;
            console.log(recentPostsData)
        }
    }



    const fetchProfileDataResponse = await fetch(`${API_URL}users/${profileUserId}/profile`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${ACS_TKN}`
        }
    })
    if (!fetchProfileDataResponse.ok) {
        console.log('ERROR')
        error(fetchProfileDataResponse.status, "Error retrieving profile")
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
                { name: 'Local Expert', color: 'bg-blue-100 text-blue-700' },
                { name: 'Top Contributor', color: 'bg-purple-100 text-purple-700' },
                { name: 'Photography Pro', color: 'bg-green-100 text-green-700' }
            ],
            recentPosts: await recentPostsData,
        }
    }


    

    console.log(recentPostsData)
    //console.log(await publicProfileRecentPosts)
    console.log(profileUserId)

    return await { profileData }
}