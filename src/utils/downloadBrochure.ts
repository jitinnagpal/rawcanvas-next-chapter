/**
 * Downloads the Mokha Designs brochure PDF file
 */
export const downloadBrochure = async () => {
  try {
    // Fetch the PDF file
    const response = await fetch('/brochures/mokha-designs-portfolio.pdf');
    
    if (!response.ok) {
      throw new Error('Failed to fetch brochure');
    }
    
    // Get the blob
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mokha-Designs-Portfolio.pdf';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading brochure:', error);
    // Fallback: try opening in new tab
    window.open('/brochures/mokha-designs-portfolio.pdf', '_blank');
  }
};
