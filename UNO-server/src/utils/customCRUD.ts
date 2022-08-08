
interface HasKey {
  <T>(container:Map<string,T>,key:string):boolean
}

interface GetKey {
  <T>(container:Map<string,T>,key:string): T | undefined
}

interface SetKey {
  <T>(container:Map<string,T>,key:string,value:T): void
}

interface DeleteKey {
  <T>(container:Map<string,T>,key:string): boolean
}

export const has:HasKey = (container,key)=>{
  return container.has(key)
}

export const get:GetKey = (container,key)=>{
  return container.get(key)
}

export const set:SetKey = (container,key, value)=>{
  container.set(key,value)
}

export const deleteKey:DeleteKey = (container,key)=>{
  return container.delete(key)
}
