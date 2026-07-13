import { isObject, objectOrEmpty, textOrEmpty } from "../../core/domain/coerce.js";

/**
 * @param {unknown} value
 * @returns {number}
 */
function numberOrZero(value) {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) ? number : 0;
}

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function numberOrNull(value) {
	const number = typeof value === "number" ? value : Number(value);
	return Number.isFinite(number) ? number : null;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function stringOrEmpty(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return "";
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function booleanOrFalse(value) {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") return value.trim().toLowerCase() === "true";
	return false;
}

/**
 * @param {unknown} value
 * @returns {boolean | null}
 */
function booleanOrNull(value) {
	if (typeof value === "boolean") return value;
	if (typeof value === "string" && value.trim().toLowerCase() === "true") return true;
	if (typeof value === "string" && value.trim().toLowerCase() === "false") return false;
	return null;
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
	const gradYear = numberOrZero(education.grad_year ?? education.year);

	return {
		university: stringOrEmpty(education.university),
		major: textOrEmpty(education.major),
		grad_year: gradYear >= 2010 ? gradYear : undefined
	};
}

/**
 * @param {unknown} value
 * @returns {import("./types.js").PublicProfileBadge[]}
 */
function mapPublicBadges(value) {
	if (!Array.isArray(value)) return [];

	return value.flatMap((rawBadge) => {
		const entry = objectOrEmpty(rawBadge);
		const badge = isObject(entry.badge) ? entry.badge : entry;
		const name = textOrEmpty(badge.name).trim();
		if (!name) return [];

		const rawTone = textOrEmpty(badge.tone) || textOrEmpty(badge.color);
		const normalizedTone = rawTone.trim().toLowerCase();
		/** @type {import("./types.js").PublicProfileBadge["tone"]} */
		const tone = normalizedTone === "blue"
			|| normalizedTone === "purple"
			|| normalizedTone === "green"
			? normalizedTone
			: "neutral";

		return [{ name, tone }];
	});
}

/**
 * @param {{ id: number; value: unknown }} post
 * @returns {import("./types.js").PublicProfilePost}
 */
function mapPublicProfilePost(post) {
	const value = objectOrEmpty(post.value);
	return {
		id: post.id,
		data: {
			title: textOrEmpty(value.title),
			content: textOrEmpty(value.content),
			updated_at: textOrEmpty(value.updated_at) || textOrEmpty(value.created_at)
		},
		image: textOrEmpty(value.media) || null
	};
}

/**
 * Maps only fields actually returned by the profile API. Missing values stay
 * absent/empty instead of being replaced with invented badges or dates.
 *
 * @param {unknown} value
 * @param {{ id: number; value: unknown }[]} recentPosts
 * @param {string} profileUserId
 * @returns {import("./types.js").PublicProfileState}
 */
export function mapPublicProfile(value, recentPosts, profileUserId) {
	const profileData = objectOrEmpty(value);
	const profile = objectOrEmpty(profileData.profile);
	const education = objectOrEmpty(profileData.education);
	const badges = mapPublicBadges(profileData.badges);
	const year = numberOrNull(education.year ?? profileData.grad_year ?? profileData.year);
	const postCount = numberOrNull(profileData.post_count);
	const likeCount = numberOrNull(profileData.like_count);

	return {
		id: numberOrZero(profileData.id) || numberOrZero(profileUserId),
		name: textOrEmpty(profileData.name).trim()
			|| textOrEmpty(profileData.username).trim()
			|| "Community Member",
		username: textOrEmpty(profileData.username),
		avatar: textOrEmpty(profile.avatar) || null,
		badge: badges[0]?.name ?? null,
		location: textOrEmpty(profileData.location),
		university: textOrEmpty(profileData.university),
		currentProgram: textOrEmpty(profileData.current_program_title),
		major: textOrEmpty(profileData.major),
		year: year && Number.isInteger(year) ? year : null,
		wentAbroad: booleanOrNull(profileData.went_abroad),
		joinDate: textOrEmpty(profileData.register_date) || null,
		bio: textOrEmpty(profile.bio),
		isVerified: booleanOrFalse(profile.is_contributer),
		staff: booleanOrFalse(profile.is_staff),
		stats: {
			posts: postCount === null ? null : Math.max(0, postCount),
			likes: likeCount === null ? null : Math.max(0, likeCount)
		},
		badges,
		recentPosts: recentPosts.map(mapPublicProfilePost)
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
