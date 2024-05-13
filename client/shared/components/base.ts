import {OnInit, Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Input } from '@angular/core';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmDialog } from '$shared/types';
import { dateToDefaultFormat,uniqid } from '$shared/utils';

@Component({
    selector: 'app-base',
    template: ``,
    styles: []
})

export default abstract class BaseComponent implements OnInit{
    constructor(public dialog : MatDialog,public confirmDialog : MatDialog){}
    @Input() onConfirmSuccess ! : ()=>void; //la fonction de rappel appelées en cas de succcess dans la boite de confirmation
    @Input() onConfirmError ! : ()=>void; // la fonction de rappel appelée en cas d'erreur dans le boite de confirmation
    /****
        ouvre une boite de dialogue 
    */
    protected openDialog<T>(Component,...rest):MatDialogRef<T> {
        return this.dialog.open(Component,...rest);
    }
    /***
        open confirm dialog message
        @param {object}, les options  : 
    */
    protected openConfirm(options:ConfirmDialog) : MatDialogRef<ConfirmComponent>{
        const conf = this.confirmDialog.open(ConfirmComponent);
        conf.componentInstance.message = options?.message;
        conf.componentInstance.onSuccess = options?.onSuccess;
        conf.componentInstance.onCancel = options.onCancel;
        conf.componentInstance.title = options.title;
        return conf;
    }
    protected uniqid (prefix : number | string, idStrLen : number = 16, separator : string = "") : string{
        return uniqid(prefix,idStrLen,separator);
    }
    /***
        format l'objet date au format par défaut
    */
    dateToDefaultFormat(date : string | Date) : string {
        return dateToDefaultFormat(date);
    }
    ngOnInit(): void {}
}