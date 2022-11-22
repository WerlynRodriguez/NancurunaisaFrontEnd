export class ActionsProviders{
    constructor(ActAct){
        this.ActAct = ActAct;
    }
    get isRead(){return this.ActAct==FormActions.Read? true:false}
    get isUpdt(){return this.ActAct==FormActions.Update? true:false}
    get isAdd(){return this.ActAct==FormActions.Add? true:false}
}

export function getaction(url,pos){
    const action = url.split("/");
    return action[pos];
}

export const FormActions={ Read:"View", Update:"Uptd", Add:"Add" }
export const UserActions={ Listar:"Listar", Ver:"Ver", Añadir:"Añadir", Editar:"Editar", CambiarE:"CambiarEstado" };