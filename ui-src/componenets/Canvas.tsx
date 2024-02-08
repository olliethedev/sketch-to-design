import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import {
  FabricJSCanvas,
  FabricJSEditor,
  useFabricJSEditor,
} from "fabricjs-react";
import {
  IconBrush,
  IconBrushFancy,
  IconColorPalette,
  IconCursor,
  IconDelete,
  IconDrag,
  IconRedo,
  IconSearch,
  IconShapes,
  IconText,
  IconUndo,
} from "./Icons";
import { cn } from "../helpers/utils";

const SIZE = {
  width: 720,
  height: 640,
  borderWidth: 3,
};

const BUTTON_CLASSES = "btn btn-sm btn-ghost";

export const Canvas = () => {
  const { editor, onReady } = useFabricJSEditor();

  const history = [];
  const [transformingViewport, setTransformingViewport] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#35363a");

  const [cursorMode, setCursorMode] = useState<"draw" | "select">("draw");

  // Initialize canvas
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(SIZE.height - SIZE.borderWidth * 2);
    editor.canvas.setWidth(SIZE.width - SIZE.borderWidth * 2);
    editor.canvas.backgroundColor = "#ffffff";
    setObjectStrokeColor("#35363a");
    editor.canvas.renderAll();
  }, [editor?.canvas.backgroundImage]);

  // Add zoom and pan functionality
  useCanvasZoomAndPan(editor, transformingViewport);

  const toggleSize = () => {
    editor.canvas.freeDrawingBrush.width === 12
      ? (editor.canvas.freeDrawingBrush.width = 5)
      : (editor.canvas.freeDrawingBrush.width = 12);
  };

  // Set brush and stroke color

  const setObjectStrokeColor = (color: string) => {
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
    setStrokeColor(color);
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.isDrawingMode = cursorMode === "draw";
  }, [editor, cursorMode]);

  const removeSelectedObject = () => {
    editor.canvas.remove(editor.canvas.getActiveObject());
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the delete key or backspace key is pressed
      if (event.keyCode === 46 || event.keyCode === 8) {
        removeSelectedObject();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [removeSelectedObject]);

  const undo = () => {
    if (editor.canvas._objects.length > 0) {
      history.push(editor.canvas._objects.pop());
    }
    editor.canvas.renderAll();
  };
  const redo = () => {
    if (history.length > 0) {
      editor.canvas.add(history.pop());
    }
  };

  const clear = () => {
    editor.canvas._objects.splice(0, editor.canvas._objects.length);
    history.splice(0, history.length);
    editor.canvas.renderAll();
  };

  const onShapeSelect = (shape: "Line" | "Circle" | "Rectangle") => {
    switch (shape) {
      case "Line":
        onAddLine();
        break;
      case "Circle":
        onAddCircle();
        break;
      case "Rectangle":
        onAddRectangle();
        break;
      default:
        console.error("Unknown shape:", shape);
    }
  };

  const onAddLine = () => {
    editor.addLine();
  };

  const onAddCircle = () => {
    editor.addCircle();
  };
  const onAddRectangle = () => {
    editor.addRectangle();
  };
  const addText = () => {
    editor.addText("inset text");
  };

  const exportImage = () => {
    const data = editor.canvas.toDataURL();
    console.log(data);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center space-x-1">
        <ActionButton
          selected={transformingViewport}
          onClick={() => {
            setCursorMode("select");
            setTransformingViewport(!transformingViewport);
          }}
          tooltip="Zoom and Pan with mouse"
        >
          <IconDrag className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          onClick={() => setCursorMode("select")}
          tooltip="Select"
          selected={cursorMode === "select"}
          disabled={transformingViewport}
        >
          <IconCursor className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          onClick={() => setCursorMode("draw")}
          tooltip="Draw"
          selected={cursorMode === "draw"}
          disabled={transformingViewport}
        >
          <IconBrush className="h-4 w-4" />
        </ActionButton>
        <ActionDivider />
        <div className="dropdown dropdown-hover">
          <label
            tabIndex={0}
            className={cn(
              "btn btn-sm btn-ghost",
              transformingViewport ? "btn-disabled" : ""
            )}
          >
            <IconShapes className="h-4 w-4" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu shadow bg-base-100 rounded w-32"
          >
            <li>
              <a className="btn-sm" onClick={() => onShapeSelect("Line")}>
                Line
              </a>
            </li>
            <li>
              <a className="btn-sm" onClick={() => onShapeSelect("Circle")}>
                Circle
              </a>
            </li>
            <li>
              <a className="btn-sm" onClick={() => onShapeSelect("Rectangle")}>
                Rectangle
              </a>
            </li>
          </ul>
        </div>
        <ActionButton
          onClick={addText}
          tooltip="Add Text"
          disabled={transformingViewport}
        >
          <IconText className="h-4 w-4" />
        </ActionButton>
        <ActionDivider />
        {/* todo: make this a dropdown */}
        <ActionButton
          onClick={toggleSize}
          disabled={transformingViewport}
          tooltip="Brush Size"
        >
          <IconBrushFancy className="h-4 w-4" />
        </ActionButton>
        <ActionColorPicker
          onClick={(color) => setObjectStrokeColor(color)}
          disabled={transformingViewport}
          tooltip="Color Picker"
        >
          <IconColorPalette className="h-4 w-4" />
        </ActionColorPicker>

        <ActionDivider />

        <ActionButton
          onClick={undo}
          disabled={transformingViewport}
          tooltip="Undo"
        >
          <IconUndo className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          onClick={redo}
          disabled={transformingViewport}
          tooltip="Redo"
        >
          <IconRedo className="h-4 w-4" />
        </ActionButton>
        <ActionButton
          onClick={clear}
          disabled={transformingViewport}
          tooltip="Clear"
        >
          <IconDelete className="h-4 w-4" />
        </ActionButton>

        <ActionDivider />

        <button
          className="btn btn-xs btn-success"
          onClick={exportImage}
          disabled={transformingViewport}
        >
          Export Drawing
        </button>
      </div>

      <div
        style={{
          border: `${SIZE.borderWidth}px ${
            transformingViewport ? "dotted" : "solid"
          } Green`,
          width: `${SIZE.width}px`,
          height: `${SIZE.height}px`,
        }}
      >
        <FabricJSCanvas className="sample-canvas" onReady={onReady} />
      </div>
    </div>
  );
};

const useCanvasZoomAndPan = (
  editor: FabricJSEditor | undefined,
  transformingViewport: boolean
) => {
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }

    if (!transformingViewport) {
      editor.canvas.__eventListeners = {};
      return;
    }

    let lastPosX = 0;
    let lastPosY = 0;
    let isDragging = false;

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
        var delta = opt.e.deltaY;
        var zoom = editor.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        isDragging = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
        if (isDragging) {
          var e = opt.e;
          var vpt = editor.canvas.viewportTransform;
          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;
          editor.canvas.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
        //dragging done
        isDragging = false;
      });
    }

    editor.canvas.renderAll();
  }, [editor, transformingViewport]);
};

interface ActionButtonProps {
  selected?: boolean;
  disabled?: boolean;
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
}

const ActionButton = ({
  onClick,
  children,
  tooltip,
  selected,
  disabled,
}: ActionButtonProps) => {
  return (
    <div className="tooltip tooltip-bottom tooltip-info" data-tip={tooltip}>
      <button
        className={cn(BUTTON_CLASSES, selected && "btn-active")}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

const ActionColorPicker = ({
  children,
  tooltip,
  selected,
  disabled,
  onClick,
}: Omit<ActionButtonProps, "onClick"> & {
  onClick: (color: string) => void;
}) => {
  const id = useId();
  return (
    <div className="tooltip tooltip-bottom tooltip-info" data-tip={tooltip}>
      <label
        htmlFor={id}
        className={cn(
          BUTTON_CLASSES,
          selected && "btn-active",
          disabled && "btn-disabled"
        )}
        style={{ cursor: "pointer" }}
      >
        {children}
      </label>
      <input
        type="color"
        className="hidden"
        id={id}
        value="#2563eb"
        title="Choose your color"
        onChange={(e) => onClick(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

const ActionDivider = () => {
  return <div className="border-r border-base-content h-8 mx-2" />;
};

function useId() {
  const [id] = React.useState(() => Math.random().toString(36).substr(2, 9));
  return id;
}
