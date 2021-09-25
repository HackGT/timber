import React from "react";

export type ModalState = {
  visible: boolean;
  initialValues: any;
  hiddenValues?: any;
};

export interface FormModalProps {
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
}
