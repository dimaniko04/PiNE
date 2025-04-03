export class Service {
  static base = "http://localhost:3000";

  static async getLongestWord(text: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res = await fetch(`${this.base}/get-longest-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const word = await res.text();

    if (!res.ok) {
      throw new Error(word || "Unknown error");
    }

    return word;
  }
}
