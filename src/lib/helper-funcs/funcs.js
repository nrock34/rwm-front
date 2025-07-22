


export const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInDays < 30) return `${diffInWeeks}wk ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}m ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`
    // return date.toLocaleDateString();
};

export const getDaysUntil = (deadline) => {

    const today = new Date();
    const deadlineDate = new Date(deadline);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return diffDays
    if (diffDays < 1) return 'TODAY';
    return diffDays;

}

export const capitalize = (string) => {

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

}