/**
 * Generates and downloads a vCard file with Mokha Designs contact information
 */
export const downloadVCard = () => {
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:Mokha Designs
ORG:Mokha Designs
TEL;TYPE=WORK,VOICE:+919908392200
EMAIL:mokhadesigns@outlook.com
URL:https://www.mokhadesigns.com/
END:VCARD`;

  // Create blob with vCard data
  const blob = new Blob([vCardData], { type: 'text/vcard' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mokha-designs-contact.vcf';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
