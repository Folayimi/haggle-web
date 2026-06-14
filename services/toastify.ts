import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notify = (text:string)=>{
    toast.success(text)
}

export const notifyError = (text:string)=>{
    toast.error(text)
}
