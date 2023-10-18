export function formatISODate(isoDate: string | undefined) {
    if (!isoDate) return ;
    const dateObject = new Date(isoDate);
  
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Zero-padded month
    const day = String(dateObject.getDate()).padStart(2, "0"); // Zero-padded day
    const hours = String(dateObject.getHours()).padStart(2, "0"); // Zero-padded hours
    const minutes = String(dateObject.getMinutes()).padStart(2, "0"); // Zero-padded minutes
  
    return `${hours}:${minutes}, ${day}-${month}-${year}`;
  }