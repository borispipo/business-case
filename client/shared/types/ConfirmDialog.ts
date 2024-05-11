export default interface ConfirmDialog {
    onSuccess? : ()=>void;
    onCancel?  : ()=>void;
    message?  :  string;
    title?   : string;
}