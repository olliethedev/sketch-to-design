import * as React  from 'react'
import { useState, useMemo } from 'react'
import Modal from '../componenets/Modal';


export const useModal = (
  initialState: boolean = false,
  onClose?: (() => void) | undefined
) => {
  const [isOpen, setIsOpen] = useState(initialState);
  return useMemo(
    () => ({
      Modal: ({
        children,
        title,
      }: {
        children?: React.ReactNode;
        title: string;
      }) => (
        <Modal
          title={title}
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            onClose && onClose();
          }}
        >
          {children}
        </Modal>
      ),
      toggleModal: () => {
        console.log("toggleModal");
        setIsOpen(!isOpen);
        onClose && onClose();
      },
      isModalOpen: isOpen,
    }),
    [isOpen, onClose]
  );
};
