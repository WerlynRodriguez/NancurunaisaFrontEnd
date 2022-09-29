export class TerataFormActionProvider{
    constructor(ActAct){
        this.ActAct = ActAct;
    }
    get isRead(){return this.ActAct==FormActions.Read? true:false}
    get isUpdt(){return this.ActAct==FormActions.Update? true:false}
    get isAdd(){return this.ActAct==FormActions.Add? true:false}
}

export function getaction(url){
    const action = url.split("/");
    return action[4];
}

export const FormActions={ Read:"View", Update:"Uptd", Add:"Add" }