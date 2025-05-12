export const formatDate = (date: string | Date | number[] | null, includeTime: boolean = false): string => {
  if (!date) return 'N/A';
  
  if (Array.isArray(date)) {
    // Handle number array format [year, month, day, hour, minute, second, millisecond]
    const [year, month, day] = date;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${monthNames[month - 1]} ${day}, ${year}`;
  } else if (typeof date === 'string') {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};