import { describe, expect, it } from "vitest";
import {
	mapProfileApplications,
	mapProfileEducationSettings,
	mapProfileSavedItems,
	mapProfileSummary,
	mapPublicProfile
} from "../../../src/domains/profile/mappers.js";

describe("profile summary mapping", () => {
	it("fills safe defaults when the API returns a partial profile", () => {
		const summary = mapProfileSummary({
			username: "naeem",
			major: "Computer Science",
			profile: {
				avatar: null
			}
		});

		expect(summary).toEqual({
			name: "naeem",
			username: "naeem",
			email: "",
			phone: "",
			location: "",
			university: "",
			major: "Computer Science",
			bio: "",
			avatar: null,
			isIncompleteProfile: true
		});
	});

	it("maps partial applications without throwing on missing nested fields", () => {
		const applications = mapProfileApplications([
			{
				id: 7,
				status: "in-progress",
				progress: 45,
				application_to: null,
				app_info: {}
			}
		]);

		expect(applications).toEqual([
			{
				id: 7,
				title: "Untitled application",
				provider: "",
				type: "application",
				status: "in-progress",
				deadline: new Date(0).toISOString(),
				submitted: null,
				progress: 45
			}
		]);
	});

	it("maps saved items safely when provider and author objects are missing", () => {
		const savedItems = mapProfileSavedItems({
			programs: [{ id: 2, title: "Semester Abroad", provider: null, cost: null }],
			scholarships: [{ id: 3, name: "Global Grant", provider: null }],
			resources: [{ id: 4, title: "Visa Guide", author: null }]
		});

		expect(savedItems).toEqual([
			{
				id: 2,
				type: "program",
				title: "Semester Abroad",
				provider: "",
				author: "",
				amount: "",
				cost: "",
				downloads: 0,
				views: 0,
				dateSaved: new Date(0).toISOString()
			},
			{
				id: 3,
				type: "scholarship",
				title: "Global Grant",
				provider: "",
				author: "",
				amount: "",
				cost: "",
				downloads: 0,
				views: 0,
				dateSaved: new Date(0).toISOString()
			},
			{
				id: 4,
				type: "resource",
				title: "Visa Guide",
				provider: "",
				author: "",
				amount: "",
				cost: "",
				downloads: 0,
				views: 0,
				dateSaved: new Date(0).toISOString()
			}
		]);
	});

	it("maps null education fields into safe form defaults", () => {
		const education = mapProfileEducationSettings({
			university: null,
			major: null,
			grad_year: null
		});

		expect(education).toEqual({
			university: "",
			major: "",
			grad_year: undefined
		});
	});

	it("maps public profile fields without inventing badges or dates", () => {
		const profile = mapPublicProfile({
			name: "Ada Lovelace",
			username: "ada",
			profile: {
				bio: "Mathematician",
				avatar: null,
				is_contributer: true
			},
			badges: [1, 2],
			post_count: 2,
			like_count: 7
		}, [], "42");

		expect(profile).toMatchObject({
			id: 42,
			name: "Ada Lovelace",
			badge: null,
			joinDate: null,
			badges: [],
			isVerified: true,
			stats: { posts: 2, likes: 7 }
		});
	});
});
