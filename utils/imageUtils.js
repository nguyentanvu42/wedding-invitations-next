export function toDirectImageUrl(url) {
  if (!url) return url
  const driveMatch = url.match(/\/file\/d\/([^/]+)/)
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
  }
  return url
}

export function isGoogleDriveUrl(url) {
  return url && url.includes('drive.google.com')
}
