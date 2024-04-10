export function transformBytesInKb(bytes: number): number {
  return parseFloat((bytes / 1024).toFixed(2))
}
