import { API_URL } from "$env/static/private";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch, locals, data }) => {

    let savedItemData

    let ACS_TKN = locals.token

    const fetchSavedItemsResponse = await fetch(
        `${API_URL}users/me/saved-items`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACS_TKN}`
            }
        }
    )
    if (!fetchSavedItemsResponse.ok) {
        error(fetchSavedItemsResponse.status)
    } else {

        savedItemData = await fetchSavedItemsResponse.json()
        let savedItems = []

        let programs = savedItemData.programs
        let scholarships = savedItemData.scholarships
        let resources = savedItemData.resources

        for (let i = 0; i < programs.length; i++) {
            let program = programs[i]
            savedItems.push(
                {
                    id: program.id,
                    type: 'program', 
                    title: program.title,
                    provider: program.provider.name,
                    cost: program.cost.program_fee + program.cost.accomodation_fee + program.cost.extra_fee,
                    duration: program.duration,
                    dateSaved: 'N/A',
                }
            )
        }

        for (let i = 0; i < scholarships.length; i++) {
            let scholarship = scholarships[i]
            console.log(scholarship)
            savedItems.push(
                {
                    id: 1,
                    type: 'scholarship',
                    title: scholarship.name,
                    provider: scholarship.provider.name,
                    amount: `$${scholarship.lower_bound} - $${scholarship.upper_bound}`,
                    deadline: scholarship.deadline,
                    dateSaved: 'N/A'
                }
            )
        }

        for (let i = 0; i < resources.length; i++) {
            let resource = resources[i]
            console.log(resource)
            if (resource.title && resource.author) {
                savedItems.push(
                {
                    id: 3,
                    type: 'resource',
                    title: resource.title,
                    category: resource.category,
                    author: resource.author.name,
                    downloads: 0,
                    views: resource.views,
                    dateSaved: 'N/A'
                })
            }
        }

        savedItemData = savedItems

    }

    return {
        ...data, savedItemData
    }

}