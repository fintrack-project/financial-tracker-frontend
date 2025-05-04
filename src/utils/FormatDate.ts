export const formatDate = (
  dateArray: number[] | null | undefined,
  includeTime: boolean = false
): string => {
  if(dateArray === null || dateArray === undefined) {
    return 'N/A'; // Handle null or undefined
  } 

  if (!dateArray || dateArray.length < 3) {
    return 'Invalid Date'; // Handle invalid arrays
  }

  // Extract date components from the array
  const [year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0] = dateArray;

  // Create a Date object
  const date = new Date(year, month - 1, day, hour, minute, second, millisecond / 1_000_000);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  // Format the date as yyyy-MM-dd
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

  // If includeTime is true, add HH:MM:SS
  if (includeTime) {
    const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
      2,
      '0'
    )}:${String(date.getSeconds()).padStart(2, '0')}`;
    return `${formattedDate} ${formattedTime}`;
  }

  return formattedDate;
};