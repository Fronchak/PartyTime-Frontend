import { reactive } from 'vue';

const flashMessageStore = reactive({
    message: undefined,
    messageClass: 'alert-primary',
    setMessage(newMessage, messageClass='alert-primary', time=5000) {
        this.message = newMessage;
        this.messageClass = messageClass;
        if(newMessage) {
            setTimeout(() => {
                this.message = undefined;
            }, time); 
        }
    }
});

export default flashMessageStore;