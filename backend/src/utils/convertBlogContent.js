export const convertToSlug = (title) => {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '-')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const convertToExcerpt = (markdownContent, length = 150) => {
  if (!markdownContent) return '';

  // 1. Remove Code Blocks (```...```)
  let cleanText = markdownContent.replace(/```[\s\S]*?```/g, "");

  // 2. Remove Images (![alt](url))
  cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, "");

  // 3. Remove Links ([text](url)) -> keep text
  cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 4. Remove HTML tags
  cleanText = cleanText.replace(/<[^>]*>/g, "");

  // 5. Split into lines to process headers and find first para
  const lines = cleanText.split('\n');

  let firstPara = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip Headers
    if (trimmed.startsWith('#')) continue;
    // Skip Blockquotes
    if (trimmed.startsWith('>')) continue;
    // Skip Code Blocks
    if (trimmed.startsWith('`')) continue;
    // Skip Underscores
    if (trimmed.startsWith('_')) continue;
    // Skip Horizontal Rules
    if (trimmed.match(/^[-*_]{3,}$/)) continue;

    // Found potential paragraph
    // User mentioned "starts with '-' or normal words"
    if (trimmed.match(/^[a-zA-Z0-9\-_*]/)) {
      // Clean up bold/italic markers
      firstPara = trimmed
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/`(.+?)`/g, "$1");
      break;
    }
  }

  if (!firstPara) return "";

  return firstPara.length > length
    ? firstPara.substring(0, length) + "..."
    : firstPara;
}