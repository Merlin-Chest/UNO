export const userCollection = new Map();

export function createUser(args: any): any {
  const { id, name } = args;
  return {
    id, name,
  };
}
