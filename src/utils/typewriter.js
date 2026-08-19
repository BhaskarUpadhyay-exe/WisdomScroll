export async function typeWriter(
  text,
  onUpdate,
  speed = 15
) {
  let current = "";

  const words = text.split(" ");

  for (const word of words) {
    current += word + " ";

    onUpdate(current);

    await new Promise((resolve) =>
      setTimeout(resolve, speed)
    );
  }
}