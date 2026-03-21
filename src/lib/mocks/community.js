import { posts } from "./posts.js";

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   content: string;
 *   date: string;
 *   type: string;
 *   urgent: boolean;
 *   category: string;
 * }} CommunityAnnouncement
 */

/**
 * @typedef {{
 *   name: string;
 *   date: string;
 * }} CommunityDeadline
 */

/**
 * @typedef {{
 *   name: string;
 *   value: number;
 * }} CommunityStat
 */

/**
 * @typedef {{
 *   tag: string;
 *   posts: number;
 * }} CommunityTag
 */

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   provider: string;
 *   amount: string;
 *   deadline: string;
 *   category: string;
 *   location: string;
 *   description: string;
 *   qualifications: string[];
 *   status: string;
 *   featured: boolean;
 * }} CommunityScholarship
 */

/** @type {CommunityAnnouncement[]} */
export const communityAnnouncements = [
	{
		id: 1,
		title: "New Housing Options Available for Spring 2024",
		content: "We've partnered with additional housing providers in Trastevere and Testaccio neighborhoods.",
		date: "2024-01-15T10:30:00Z",
		type: "housing",
		urgent: false,
		category: "Housing"
	},
	{
		id: 2,
		title: "Visa Processing Updates - Action Required",
		content: "New documentation requirements effective immediately. Submit additional forms by January 25th.",
		date: "2024-01-12T14:15:00Z",
		type: "visa",
		urgent: true,
		category: "Visa & Immigration"
	},
	{
		id: 3,
		title: "Cultural Immersion Workshop Series Begins",
		content: "Monthly workshops to understand Italian culture and customs. Registration required.",
		date: "2025-07-01T09:00:00Z",
		type: "cultural",
		urgent: false,
		category: "Cultural Programs"
	},
	{
		id: 4,
		title: "Emergency Contact System Update",
		content: "New 24/7 emergency hotline active. Update emergency contacts by January 20th.",
		date: "2024-01-08T16:45:00Z",
		type: "safety",
		urgent: true,
		category: "Safety & Security"
	}
];

/** @type {CommunityDeadline[]} */
export const communityDeadlines = [
	{ name: "Housing", date: "Feb 1" },
	{ name: "Visa Documents", date: "Mar 23" }
];

/** @type {CommunityStat[]} */
export const communityStats = [
	{ name: "Active Students", value: 1247 },
	{ name: "Total Students", value: 47331 },
	{ name: "Online Now", value: 34 },
	{ name: "Posts Today", value: 7 }
];

/** @type {CommunityTag[]} */
export const communityTrendingTags = [
	{ tag: "study-abroad-tips", posts: 45 },
	{ tag: "rome-photography", posts: 38 },
	{ tag: "italian-language", posts: 32 },
	{ tag: "weekend-trips", posts: 28 },
	{ tag: "scholarship-help", posts: 24 }
];

/** @type {CommunityScholarship[]} */
export const communityScholarships = [
	{
		id: 1,
		title: "Fulbright Student scholarship",
		provider: "U.S. Department of State",
		amount: "$25,000 - $50,000",
		deadline: "2024-03-15",
		category: "cultural",
		location: "Italy",
		description: "Funding for one academic year of study or research in Italy.",
		qualifications: ["U.S. citizenship", "Bachelor's degree", "Language proficiency"],
		status: "open",
		featured: true
	},
	{
		id: 2,
		title: "Erasmus+ Scholarship",
		provider: "European Commission",
		amount: "EUR300 - EUR600/month",
		deadline: "2024-04-01",
		category: "cultural",
		location: "European Union",
		description: "Support for students studying in EU countries.",
		qualifications: ["EU citizenship or enrolled in EU institution", "Good academic standing"],
		status: "open",
		featured: false
	},
	{
		id: 3,
		title: "Benjamin A. Gilman Scholarship",
		provider: "U.S. Department of State",
		amount: "Up to $5,000",
		deadline: "2024-03-01",
		category: "need",
		location: "Worldwide",
		description: "Awards for U.S. undergraduate students with limited financial means.",
		qualifications: ["Pell Grant recipient", "U.S. citizenship", "Undergraduate status"],
		status: "closing-soon",
		featured: true
	}
];

/** @type {import("$domains/content/types.js").Program[]} */
export const communityPrograms = [
	{
		id: 1,
		title: "Semester in Florence",
		provider: "Florence University of the Arts",
		location: "Florence, Italy",
		region: "europe",
		duration: "1 Semester",
		cost: "$18,000",
		deadline: "2024-04-15",
		rating: 4.8,
		participants: 45,
		description: "Immerse yourself in Renaissance art and Italian culture.",
		highlights: ["Art History Focus", "Italian Language", "Cultural Immersion", "Museum Access"],
		featured: true
	},
	{
		id: 2,
		title: "Tokyo Business Program",
		provider: "Waseda University",
		location: "Tokyo, Japan",
		region: "asia",
		duration: "1 Year",
		cost: "$22,000",
		deadline: "2024-03-30",
		rating: 4.9,
		participants: 32,
		description: "Study international business and Japanese culture.",
		highlights: ["Business Focus", "Japanese Language", "Internship Opportunities", "Tech Industry"],
		featured: true
	},
	{
		id: 3,
		title: "Barcelona Architecture",
		provider: "Universitat Politecnica de Catalunya",
		location: "Barcelona, Spain",
		region: "europe",
		duration: "1 Semester",
		cost: "$16,500",
		deadline: "2024-05-01",
		rating: 4.7,
		participants: 28,
		description: "Explore modernist architecture and urban planning.",
		highlights: ["Architecture Focus", "Urban Planning", "Spanish Language", "Design Studios"],
		featured: false
	}
];

export const communityPosts = posts;
