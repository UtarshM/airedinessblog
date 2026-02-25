const markdownContent = `
# Best Coffee Beans in 2026

If you are looking for the absolute best coffee beans this year, you have come to the right place. The market has exploded. 

## Top Picks
- Bean A
- Bean B
`;

const title = "Best Coffee Beans in 2026";
const plainTextBlocks = markdownContent.replace(/[#*`~>-]+/g, '').split('\n').map((l) => l.trim()).filter((l) => l.length > 20);
let plainText = plainTextBlocks.length > 0 ? plainTextBlocks[0] : title;
if (plainText.toLowerCase().startsWith(title.toLowerCase())) {
    plainText = plainTextBlocks.length > 1 ? plainTextBlocks[1] : plainText;
}
const metaDescription = plainText.length > 160 ? plainText.substring(0, 157) + "..." : plainText;

console.log("META DESC:", metaDescription);
