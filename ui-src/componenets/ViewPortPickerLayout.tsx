import * as React from "react";
import { SCREEN_SIZES } from "../helpers/html-helper";
import { IconDesktop } from "./Icons";

interface ViewPortPickerLayoutProps {
    selected: keyof typeof SCREEN_SIZES;
    onChange: (size: keyof typeof SCREEN_SIZES) => void;
  }
  
 export const ViewPortPickerLayout = ({
    selected,
    onChange,
  }: ViewPortPickerLayoutProps) => {
    return (
      <div className="dropdown dropdown-hover">
        <label tabIndex={0} className="btn btn-sm gap-1">
          <IconDesktop/>
          {selected}</label>
        <ul tabIndex={0} className="dropdown-content z-[1] my-0 px-0 menu shadow bg-base-200 w-40">
          {Object.keys(SCREEN_SIZES).map((size) => (
            <li key={size} className="px-0 my-0" onClick={() => onChange(size as keyof typeof SCREEN_SIZES)}>
              <a className={selected === size ? "font-bold" : ""}>{size}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };