export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}
