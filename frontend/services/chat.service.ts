export interface AskPayload {
  question: string;
  topK?: number;
}

export async function askQuestion(payload: AskPayload) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
