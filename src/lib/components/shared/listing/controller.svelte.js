/**
 * @template T
 * @param {{
 *   items: T[];
 *   filters?: ((item: T) => boolean)[];
 *   search?: (item: T) => boolean;
 *   sort?: (a: T, b: T) => number;
 *   page: number;
 *   perPage: number;
 * }} params
 * @returns {{
 *   filtered: T[];
 *   sorted: T[];
 *   paginated: T[];
 *   totalPages: number;
 *   page: number;
 *   setPage: (nextPage: number) => number;
 *   resetPage: () => number;
 * }}
 */
export function createListController(params) {
	const { items, filters = [], search, sort, page, perPage } = params;

	const filtered = items.filter((item) => {
		const filterPass = filters.every((predicate) => predicate(item));
		const searchPass = search ? search(item) : true;
		return filterPass && searchPass;
	});

	const sorted = sort ? [...filtered].sort(sort) : [...filtered];
	const totalPages = Math.ceil(sorted.length / perPage);
	const safePage = Math.min(Math.max(page, 1), totalPages || 1);
	const start = (safePage - 1) * perPage;
	const end = start + perPage;
	const paginated = sorted.slice(start, end);

	return {
		filtered,
		sorted,
		paginated,
		totalPages,
		page: safePage,
		setPage: (nextPage) => Math.min(Math.max(nextPage, 1), totalPages || 1),
		resetPage: () => 1
	};
}
