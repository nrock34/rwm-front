import { isObject, objectOrEmpty, textOrEmpty } from "../../core/domain/coerce.js";

/**
 * @param {unknown} value
 * @returns {number}
 */
function numberOrZero(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function numberOrNull(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isMissing(value) {
	return value === null || value === undefined || value === "";
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function formatMoney(value) {
	const amount = numberOrZero(value);
	return amount > 0 ? `$${amount.toLocaleString()}` : "";
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").EditableProfileInfoState}
 */
export function mapEditableProfileInfo(value) {
	if (!isObject(value)) {
		return {
			formData: {
				first_name: "",
				last_name: "",
				username: "",
				bio: "",
				birthday: "",
				avatar: undefined
			},
			currentAvatarUrl: null
		};
	}

	return {
		formData: {
			first_name: typeof value.first_name === "string" ? value.first_name : "",
			last_name: typeof value.last_name === "string" ? value.last_name : "",
			username: typeof value.username === "string" ? value.username : "",
			bio: typeof value.bio === "string" ? value.bio : "",
			birthday: typeof value.birthday === "string" ? value.birthday : "",
			avatar: undefined
		},
		currentAvatarUrl: typeof value.avatar === "string" ? value.avatar : null
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileSummaryState}
 */
export function mapProfileSummary(value) {
	if (!isObject(value)) {
		return {
			name: "Your Profile",
			username: "",
			email: "",
			phone: "",
			location: "",
			university: "",
			major: "",
			bio: "",
			avatar: null,
			isIncompleteProfile: true
		};
	}

	const profile = isObject(value.profile) ? value.profile : {};
	const username = textOrEmpty(value.username);
	const rawName = textOrEmpty(value.name);
	const name = rawName || username || "Your Profile";
	const email = textOrEmpty(value.email);
	const phone = textOrEmpty(value.phone_num);
	const location = textOrEmpty(value.location);
	const university = textOrEmpty(value.university);
	const major = textOrEmpty(value.major);
	const bio = textOrEmpty(profile.bio);
	const avatar = textOrEmpty(profile.avatar) || null;
	const isIncompleteProfile = [
		rawName || username,
		email,
		phone,
		location,
		university,
		major,
		bio
	].some(isMissing);

	return {
		name,
		username,
		email,
		phone,
		location,
		university,
		major,
		bio,
		avatar,
		isIncompleteProfile
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileAccountSettingsState}
 */
export function mapProfileAccountSettings(value) {
	const account = objectOrEmpty(value);

	return {
		email: textOrEmpty(account.email),
		first_name: textOrEmpty(account.first_name),
		last_name: textOrEmpty(account.last_name),
		username: textOrEmpty(account.username)
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileEducationSettingsState}
 */
export function mapProfileEducationSettings(value) {
	const education = objectOrEmpty(value);
	const gradYear = numberOrZero(education.grad_year);

	return {
		university: textOrEmpty(education.university),
		major: textOrEmpty(education.major),
		grad_year: gradYear >= 2010 ? gradYear : undefined
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileActivityItem[]}
 */
export function mapProfileActivityList(value) {
	if (!Array.isArray(value)) return [];

	return value.map((activity, index) => {
		const entry = objectOrEmpty(activity);

		return {
			id: numberOrZero(entry.id) || index + 1,
			type: textOrEmpty(entry.type) || "post",
			action: textOrEmpty(entry.action) || "updated",
			target: textOrEmpty(entry.target) || "your activity",
			targetObjId: numberOrNull(entry.object_id),
			user: textOrEmpty(entry.user),
			timestamp: textOrEmpty(entry.timestamp) || new Date(0).toISOString()
		};
	});
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileApplicationItem[]}
 */
export function mapProfileApplications(value) {
	if (!Array.isArray(value)) return [];

	return value.map((application, index) => {
		const entry = objectOrEmpty(application);
		const applicationTo = objectOrEmpty(entry.application_to);
		const appInfo = objectOrEmpty(entry.app_info);

		return {
			id: numberOrZero(entry.id) || index + 1,
			title: textOrEmpty(applicationTo.name) || "Untitled application",
			provider: textOrEmpty(applicationTo.provider_name),
			type: textOrEmpty(entry.type) || "application",
			status: textOrEmpty(entry.status) || "pending",
			deadline: textOrEmpty(appInfo.deadline) || new Date(0).toISOString(),
			submitted: textOrEmpty(entry.submitted) || null,
			progress: Math.max(0, Math.min(100, numberOrZero(entry.progress)))
		};
	});
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").ProfileSavedItem[]}
 */
export function mapProfileSavedItems(value) {
	const saved = objectOrEmpty(value);
	const programs = Array.isArray(saved.programs) ? saved.programs : [];
	const scholarships = Array.isArray(saved.scholarships) ? saved.scholarships : [];
	const resources = Array.isArray(saved.resources) ? saved.resources : [];

	/** @type {import("./types.js").ProfileSavedItem[]} */
	const items = [];

	for (const program of programs) {
		const entry = objectOrEmpty(program);
		const provider = objectOrEmpty(entry.provider);
		const cost = objectOrEmpty(entry.cost);
		const totalCost = numberOrZero(cost.program_fee) + numberOrZero(cost.accomodation_fee) + numberOrZero(cost.extra_fee);

		items.push({
			id: numberOrZero(entry.id),
			type: "program",
			title: textOrEmpty(entry.title) || "Untitled program",
			provider: textOrEmpty(provider.name),
			author: "",
			amount: "",
			cost: formatMoney(totalCost),
			downloads: 0,
			views: 0,
			dateSaved: new Date(0).toISOString()
		});
	}

	for (const scholarship of scholarships) {
		const entry = objectOrEmpty(scholarship);
		const provider = objectOrEmpty(entry.provider);
		const lowerBound = numberOrZero(entry.lower_bound);
		const upperBound = numberOrZero(entry.upper_bound);
		const amount = lowerBound || upperBound
			? `$${lowerBound.toLocaleString()} - $${upperBound.toLocaleString()}`
			: "";

		items.push({
			id: numberOrZero(entry.id),
			type: "scholarship",
			title: textOrEmpty(entry.name) || "Untitled scholarship",
			provider: textOrEmpty(provider.name),
			author: "",
			amount,
			cost: "",
			downloads: 0,
			views: 0,
			dateSaved: new Date(0).toISOString()
		});
	}

	for (const resource of resources) {
		const entry = objectOrEmpty(resource);
		const author = objectOrEmpty(entry.author);

		items.push({
			id: numberOrZero(entry.id),
			type: "resource",
			title: textOrEmpty(entry.title) || "Untitled resource",
			provider: "",
			author: textOrEmpty(author.name),
			amount: "",
			cost: "",
			downloads: numberOrZero(entry.downloads),
			views: numberOrZero(entry.views),
			dateSaved: new Date(0).toISOString()
		});
	}

	return items;
}
