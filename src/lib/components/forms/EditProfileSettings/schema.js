
import { bool, boolean, object, string } from "yup";


export const profileVisibilityOptions = [
    {id: 'public', label: 'Public'},
    {id: 'private', label: 'Private'},
    // {id: 'friends', label: 'Friends Only'}
]

export const emailNotificationOptions = [
    {id: 'scholarshipOpportunities', label: 'New Scholarship Opportunities'},
    {id: 'applicationDeadlines', label: 'Tracked Application Deadlines'},
    {id: 'communityDeadlines', label: 'Community Deadlines'}
]

export const profileSettingsSchema = object({
    profileVisibility: string()
        .oneOf(profileVisibilityOptions.map(option => option.id),
            `must be one of ${profileVisibilityOptions.map(option => option.id).join(', ')}`),
    emailNotifications: object(
        emailNotificationOptions.reduce(
            (acc, option, idx) => {
                acc[option.id] = boolean().default(false);
                return acc;
            }, {})
        )
})