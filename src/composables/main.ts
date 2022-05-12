import notify from "~/plugins/notification/notify";

export function useNotify(content?:string, duration?:number){
  if(!content) return;
    notify({
      content,
      duration
    })
}
