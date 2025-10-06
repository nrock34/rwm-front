/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent }) {
    await parent();
    return {};
}