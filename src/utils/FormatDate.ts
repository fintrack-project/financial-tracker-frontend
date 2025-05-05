export const formatDate = (date: string | Date | number[] | null, includeTime: boolean = false): string => {
  if (!date) return 'N/A';
  
  let dateObj: Date;
  
  if (Array.isArray(date)) {
    // Handle number array format [year, month, day, ...]
    dateObj = new Date(date[0], date[1] - 1, date[2]);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return dateObj.toLocaleDateString('en-US', options);
};