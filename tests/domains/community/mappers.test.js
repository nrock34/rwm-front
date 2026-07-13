import { describe, expect, it } from "vitest";
import {
	deriveUpcomingDeadlines,
	deriveCommunityStats,
	deriveHomeActivity,
	deriveTrendingTags,
	mapCommunityPost,
	mapCommunityProgram,
	mapCommunityScholarship,
	mapCommunityUpdate,
	mapCommunityUpdateDetail
} from "../../../src/domains/community/mappers.js";

describe("community mappers", () => {
	it("maps posts into UI-ready cards", () => {
		const post = mapCommunityPost({
			id: 12,
			title: "Housing tips",
			content: "Try looking near the tram line.",
			media: "https://cdn.example.test/post.jpg",
			type: "discussion",
			category: { id: 3, name: "housing" },
			author: {
				id: 2,
				name: "Naeem Hawkins",
				avatar: "https://cdn.example.test/avatar.jpg",
				associated_user: 7
			},
			created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			updated_at: new Date().toISOString(),
			published: true,
			views: 18,
			tags: [{ id: 1, name: "housing" }, { id: 2, name: "rome" }],
			like_count: 4,
			comment_count: 3,
			liked_by_viewer: true
		});

		expect(post.categoryLabel).toBe("Housing");
		expect(post.typeLabel).toBe("Discussion");
		expect(post.tags).toEqual(["housing", "rome"]);
		expect(post.viewerLiked).toBe(true);
		expect(post.href).toBe("/community/posts/12");
	});

	it("formats featured programs and scholarships for summary cards", () => {
		const program = mapCommunityProgram({
			id: 5,
			title: "Semester in Rome",
			duration: "sem",
			participants: 20,
			rating: 4.8,
			shortDescription: "Study in Rome.",
			highlights: ["Language", "History"],
			featured: true,
			application_deadline: "2030-05-01",
			provider: { name: "Roma University" },
			location: { city: "Rome", country: "Italy" },
			cost: { program_fee: 10000, accommodation_fee: 5000, extra_fee: 500 }
		});

		const scholarship = mapCommunityScholarship({
			id: 8,
			name: "Global Scholars",
			summary: "Support for study abroad.",
			categories: ["merit", "research"],
			provider: { name: "Example Foundation" },
			lower_bound: 1000,
			upper_bound: 5000,
			requirements: {
				field: "History",
				eligibility: "Open to students with strong essays.",
				grad_year: "jn",
				study_country: "Italy"
			},
			deadline: "2030-04-01",
			status: "open",
			featured: true,
			rating: 4.2
		});

		expect(program.region).toBe("europe");
		expect(program.cost).toBe("$15,500");
		expect(program.href).toBe("/programs/5");
		expect(scholarship.amount).toBe("$1,000 - $5,000");
		expect(scholarship.qualifications).toEqual(["History", "Junior", "Italy"]);
	});

	it("derives and sorts upcoming deadlines from programs and scholarships", () => {
		const deadlines = deriveUpcomingDeadlines(
			/** @type {any} */ ([
				{ id: 1, title: "Later Program", deadline: "2030-06-01", href: "/programs/1", type: "program" },
				{ id: 2, title: "Soon Program", deadline: "2030-03-01", href: "/programs/2", type: "program" }
			]),
			/** @type {any} */ ([
				{ id: 3, title: "Soon Scholarship", deadline: "2030-02-15", href: "/scholarships", type: "scholarship" },
				{ id: 4, title: "No Deadline", deadline: null, href: "/scholarships", type: "scholarship" }
			])
		);

		expect(deadlines.map((item) => item.name)).toEqual([
			"Soon Scholarship",
			"Soon Program",
			"Later Program"
		]);
	});

	it("maps updates into read-more cards", () => {
		const update = mapCommunityUpdate({
			id: 77,
			title: "Visa deadline moved",
			category: { id: 4, name: "travel" },
			image: "https://cdn.example.test/update.jpg",
			urgent: true,
			summary: "The visa submission window closes earlier this term.",
			expires_at: "2030-01-01",
			updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
			created_at: new Date().toISOString(),
			views: 100,
			shares: 7,
			comment_count: 3,
			like_count: 5
		});

		expect(update.categoryLabel).toBe("Travel");
		expect(update.href).toBe("/community/news-and-updates/77");
		expect(update.urgent).toBe(true);
	});

	it("sanitizes update detail HTML", () => {
		const update = mapCommunityUpdateDetail({
			id: 1,
			title: "Update",
			content: '<p onclick="steal()">Read me</p><iframe src="https://evil.example"></iframe>'
		});
		expect(update.content).toContain("<p>Read me</p>");
		expect(update.content).not.toMatch(/onclick|iframe/iu);
	});

	it("derives transparent summary stats and trending tags", () => {
		const posts = /** @type {any} */ ([
			{ tags: ["Rome", "housing", "rome"] },
			{ tags: ["housing", "visa"] },
			{ tags: ["visa"] }
		]);
		const summary = /** @type {any} */ ({
			posts,
			updates: [{ id: 1 }],
			featuredPrograms: [{ id: 2 }, { id: 3 }],
			featuredScholarships: []
		});

		expect(deriveCommunityStats(summary)).toEqual([
			{ name: "Posts in feed", value: 3 },
			{ name: "Recent updates", value: 1 },
			{ name: "Featured programs", value: 2 },
			{ name: "Featured scholarships", value: 0 }
		]);
		expect(deriveTrendingTags(posts)).toEqual([
			{ tag: "housing", posts: 2 },
			{ tag: "rome", posts: 2 },
			{ tag: "visa", posts: 2 }
		]);
	});

	it("builds home activity in newest-first order", () => {
		const result = deriveHomeActivity(/** @type {any} */ ({
			posts: [{ title: "Older post", timestampLabel: "2h", href: "/p/1", createdAt: "2030-01-01T10:00:00Z" }],
			updates: [{ title: "New update", timeAgo: "1h", href: "/u/1", createdAt: "", updatedAt: "2030-01-01T11:00:00Z" }],
			featuredPrograms: [],
			featuredScholarships: [],
			upcomingDeadlines: []
		}));
		expect(result.map((item) => item.title)).toEqual(["New update", "Older post"]);
	});
});
