import { Modal } from "antd";

export const ModalErrorAPI = () => {
    Modal.error({
        title: 'Error',
        content: 'Please try again later. If issues persist, please contact the IT team regarding this issue. Thank you.',
        centered: true
    });
}