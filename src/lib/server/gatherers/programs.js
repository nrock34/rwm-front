import { API_URL } from "$env/static/private"
import { error } from "@sveltejs/kit"
import { getUniDetail } from "./university"

export const getProgramDetail = async (id) => {
    const response = await fetch(`${API_URL}programs/${id}`)

    if (!response.ok) {
        if (response.status === 404) return error(
            404, {msg: response.statusText}
        )
    }

    // console.log(await response.json())

    const data = await response.json()
    console.log(data)

    const university = data.provider.university ? await getUniDetail(data.provider.university) : undefined
    
    const programData = {

        id: data.id,
        title: data.title,
        provider: data.provider,
        location: data.location,
        country: data.location.country,
        duration: data.duration,
        cost: data.cost,
        participants: data.participants,
        description: data.shortDescription,
        fullDescription: data.description,
        highlights: data.highlights,
        gallery: data.gallery,
        featured: data.featured,
        requirements: data.requirements,
        academics: {
            courses: data.academics.courses,
            fieldTrips: data.academics.trips,
            classSize: data.academics.class_size,
        },
        housing: {
            ...data.accomodations,
            cost: 'Accomodation fee located in Cost Tab'
        },
        applicationProcess: data.application_steps,
        testimonials: data.testimonials,
        contact: data.provider.contact,
        appDeadline: data.application_deadline,
    }

    if (university) {
        programData.university = university
        programData.university.students = programData.university.size
        delete programData.university.size
    }
    console.log(programData)
    return programData

}


export const getProgramList = async (params) => {
    const api = new URL(`${API_URL}programs/list`)
    for (let key in params) {
        if (params[key]) {
            api.searchParams.set(key, params[key])
        }
    }

    const response = await fetch(api.href)

    if (!response.ok) {
        return {
            error: await response.json()
        }
    }

    const data = await response.json()
    console.log(data)

    return {
        count: data.count,
        next: data.next,
        prev: data.previous,
        postcards: data.results
    }
}