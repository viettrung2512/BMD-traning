
const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format the phone number
    return `(+${cleaned.slice(0, 2)})${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8)}`;
  
  // Return the cleaned phone number if it doesn't match any expected format
  return cleaned;
}

export  { formatPhone };