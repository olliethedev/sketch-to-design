import * as React  from "react";
import { IconClose } from "./Icons";

interface Props {
  title?: string;
  open?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal = ({ title, open, onClose, children }: Props) => {
  return (
    <div
    className={`bg-base fixed z-50 inset-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 ${
      open ? "flex" : "hidden"
    }`}
    onClick={onClose}
  >
    <div
      className="bg-base-100 rounded-lg min-w-[300px] p-3 max-h-full flex flex-col"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        // e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex justify-between items-center pb-4 max-h-[10%]">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          className="rounded-full w-10 h-10 flex items-center justify-center bg-black"
          onClick={onClose}
        >
          <IconClose className="text-white" />
        </button>
      </div>
      <div className="max-h-[90%]">
        {children}
      </div>
    </div>
  </div>
  );
};

export default Modal;
