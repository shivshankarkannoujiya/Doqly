export async function askQuestion(question: string, topK = 5) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      topK,
    }),
  });
}
