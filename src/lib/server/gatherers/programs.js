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
    //console.log(data)

    const university = data.provider.university ? await getUniDetail(data.provider.university) : undefined
   // console.log(university)
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
        fields: data.fields.map(f => f.name),
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


export const getProgramList = async ({params, url}) => {
    const api = new URL(url ?? `${API_URL}programs/list`)
    
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

    const mappedResults = data.results.map((program) => {
        return {
            id: program.id,
            title: program.title,
            provider: program.provider.name,
            location: program.location?.city + ", " + program.location?.country,
            country: program.location?.country,
            duration: program.duration,
            cost: program.cost?.accommodation_fee + program.cost?.program_fee + program.cost?.extra_fee,
            costRange: 'medium',
            fields: program.fields.map(f => f.name),
            language: program.language,
            rating: program.rating,
            participants: program.participants,
            description: program.shortDescription,
            highlights: program.highlights,
            image: program.image,
            featured: program.featured,
            requirements: program.requirements
        }
    })
    // console.log(data)
    // console.log(data.next)
    return {
        next: data.next?.split('cursor=')[1],
        prev: data.previous?.split('cursor=')[1],
        results: mappedResults
    }
}