export function getRandomId(): string {
  return btoa(`${Math.random() * 99999}`);
}
