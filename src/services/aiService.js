export async function askAI(question) {
  const response = await fetch(
    `https://wisdomscroll.onrender.com?question=${encodeURIComponent(question)}`
  );

  if (!response.ok) {
    throw new Error("Failed to get AI response.");
  }

  return await response.text();
}   