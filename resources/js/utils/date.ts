export function formatDateFr(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('fr-MA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

export function getTodayDateCasablanca(): string {
    // en-CA is a handy locale that formats as YYYY-MM-DD which is required for <input type="date">
    return new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'Africa/Casablanca',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}
