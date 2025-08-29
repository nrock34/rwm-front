import { updated } from "$app/state"
import { API_URL } from "$env/static/private"

function postcardDetail(postcard) {
        return {
            id: postcard.id,
            author: {
                name: postcard.author.name,
                avatar: postcard.author.avatar,
                associated_user: postcard.author.associated_user,
                title: 'Author'
            },
            topic: postcard.category.name,
            topicId: postcard.category.id,
            tags: postcard.tags,
            title: postcard.title,
            description: postcard.excerpt,
            likes: postcard.like_count,
            image: postcard.banner_img,
            featured: postcard.featured,
            region: postcard.region,
            banner: postcard.banner_img,
            location: {
                city: postcard.location.city,
                country: postcard.location.country
            },
            content: postcard.content ?? null,
            created_at: postcard.created_at,
            updatedAt: postcard.updated_at ?? null,
            commentCount: postcard.comment_count ?? null
        }
}


export const getPostcardsList = async (params) => {

    console.log(params)

    const api = new URL(`${API_URL}postcards/list`)
    for (let key in params) {
        if (params[key]) {
            api.searchParams.set(key, params[key])
        }
    }
    

    const response = await fetch(api.href, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        return {
            error: await response.json()
        }
    }

    const data = await response.json()
    // console.log(data)
    return {
        count: data.count,
        next: data.next,
        prev: data.previous,
        postcards: data.results.map((postcard) => postcardDetail(postcard))
    }
}


export const getPostcardDetail = async (id) => {
    console.log(id)
    const api = new URL(`${API_URL}postcards/${id}`)
    const response = await fetch(api);

    if (!response.ok) {
        return {
            error: await response.statusText
        }
    }

    const data = await response.json()
    return postcardDetail(data)

}