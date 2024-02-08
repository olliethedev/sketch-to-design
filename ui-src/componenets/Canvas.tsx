import * as React from "react";
import { useEffect, useState } from "react";
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
  IconFill,
  IconRedo,
  IconShapes,
  IconText,
  IconUndo,
} from "./Icons";
import {
  createCircle,
  createRectangle,
  createLine,
  createText,
} from "../helpers/shapes";
import { cn } from "../helpers/utils";

const WINDOW_SIZE = {
  width: 720,
  height: 640,
  borderWidth: 3,
};

const BRUSH_SIZES = {
  small: 2,
  medium: 5,
  large: 12,
  extra_large: 20,
};

const DEFAULTS = {
  STROKE_COLOR: "#35363a",
  FILL_COLOR: "#ffffff",
  BRUSH_SIZE: BRUSH_SIZES.medium,
  CURSOR_MODE: "draw" as "draw" | "select",
};

const BUTTON_CLASSES = "btn btn-sm btn-ghost";
const TOOLTIPT_CLASSES = "tooltip tooltip-bottom tooltip-info max-w-32";

export const Canvas = () => {
  const { editor, onReady } = useFabricJSEditor({
    defaultFillColor: DEFAULTS.FILL_COLOR,
    defaultStrokeColor: DEFAULTS.STROKE_COLOR,
  });

  const history = [];
  const [initialized, setInitialized] = useState(false);
  const [transformingViewport, setTransformingViewport] = useState(false);
  const [strokeColor, setStrokeColor] = useState(DEFAULTS.STROKE_COLOR);
  const [fillColor, setFillColor] = useState(DEFAULTS.FILL_COLOR);
  const [cursorMode, setCursorMode] = useState<"draw" | "select">(
    DEFAULTS.CURSOR_MODE
  );
  const [brushSize, setBrushSize] = useState(DEFAULTS.BRUSH_SIZE);

  // Initialize canvas
  useEffect(() => {
    if (!editor || !fabric || initialized) {
      return;
    }
    editor.canvas.setHeight(WINDOW_SIZE.height - WINDOW_SIZE.borderWidth * 2);
    editor.canvas.setWidth(WINDOW_SIZE.width - WINDOW_SIZE.borderWidth * 2);
    editor.canvas.backgroundColor = DEFAULTS.FILL_COLOR;
    editor.canvas.freeDrawingBrush.width = DEFAULTS.BRUSH_SIZE;
    editor.canvas.freeDrawingBrush.color = DEFAULTS.STROKE_COLOR;
    editor.canvas.renderAll();
    setInitialized(true);
  }, [editor]);

  // Add zoom and pan functionality
  useCanvasZoomAndPan(editor, transformingViewport);

  // Set brush and stroke color

  const setObjectStrokeColor = (color: string) => {
    editor.canvas.freeDrawingBrush.color = color;
    editor.setStrokeColor(color);
    setStrokeColor(color);
  };

  // Set fill color
  const setObjectFillColor = (color: string) => {
    editor.setFillColor(color);
    setFillColor(color);
  };

  // Set cursor mode
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.isDrawingMode = cursorMode === "draw";
  }, [editor, cursorMode]);

  // Add keyboard shortcuts
  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    const handleKeyDown = (event) => {
      // Check if the delete key or backspace key is pressed
      if (event.keyCode === 46 || event.keyCode === 8) {
        editor.canvas.remove(editor.canvas.getActiveObject());
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  const updateBrushSize = (brushSize: number) => {
    editor.canvas.freeDrawingBrush.width = brushSize;
    setBrushSize(brushSize);
  };

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

  const onAddCircle = () => {
    const object = new fabric.Circle({
      ...createCircle(fillColor, strokeColor),
    });
    editor.canvas.add(object);
  };
  const onAddRectangle = () => {
    const object = new fabric.Rect({
      ...createRectangle(fillColor, strokeColor),
    });
    editor.canvas.add(object);
  };
  const onAddLine = () => {
    const LINE = createLine(strokeColor);
    const object = new fabric.Line(LINE.points, {
      ...LINE.options,
    });
    editor.canvas.add(object);
  };
  const onAddText = () => {
    // use stroke in text fill, fill default is most of the time transparent
    const object = new fabric.Textbox("insert text", {
      ...createText(strokeColor),
    });
    object.set({ text: "insert text" });
    editor.canvas.add(object);
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
        <ActionDropdown
          tooltip="Add Shape"
          disabled={transformingViewport}
          buttonChildren={<IconShapes className="h-4 w-4" />}
        >
          <ActionDropdownItem onClick={() => onShapeSelect("Line")}>
            Line
          </ActionDropdownItem>
          <ActionDropdownItem onClick={() => onShapeSelect("Circle")}>
            Circle
          </ActionDropdownItem>
          <ActionDropdownItem onClick={() => onShapeSelect("Rectangle")}>
            Rectangle
          </ActionDropdownItem>
        </ActionDropdown>

        <ActionButton
          onClick={onAddText}
          tooltip="Add Text"
          disabled={transformingViewport}
        >
          <IconText className="h-4 w-4" />
        </ActionButton>
        <ActionDivider />
        <ActionDropdown
          tooltip="Brush Size"
          disabled={transformingViewport}
          buttonChildren={<IconBrushFancy className="h-4 w-4" />}
        >
          {Object.keys(BRUSH_SIZES).map((key) => (
            <ActionDropdownItem
              key={key}
              onClick={() => updateBrushSize(BRUSH_SIZES[key])}
              selected={brushSize === BRUSH_SIZES[key]}
            >
              <div
                className={`w-full rounded-full bg-gray-400 capitalize`}
                style={{ height: `${BRUSH_SIZES[key]}px` }}
              />
            </ActionDropdownItem>
          ))}
        </ActionDropdown>
        <ActionColorPicker
          onClick={(color) => setObjectStrokeColor(color)}
          value={strokeColor}
          disabled={transformingViewport}
          tooltip="Stroke Color"
        >
          <IconColorPalette className="h-4 w-4" />
        </ActionColorPicker>
        <ActionColorPicker
          onClick={(color) => setObjectFillColor(color)}
          value={fillColor}
          disabled={transformingViewport}
          tooltip="Fill Color"
        >
          <IconFill className="h-5 w-5" />
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
          border: `${WINDOW_SIZE.borderWidth}px ${
            transformingViewport ? "dotted" : "solid"
          } Green`,
          width: `${WINDOW_SIZE.width}px`,
          height: `${WINDOW_SIZE.height}px`,
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
    <div className={TOOLTIPT_CLASSES} data-tip={tooltip}>
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
  value,
  children,
  tooltip,
  selected,
  disabled,
  onClick,
}: Omit<ActionButtonProps, "onClick"> & {
  value: string;
  onClick: (color: string) => void;
}) => {
  const id = useId();
  return (
    <div className={TOOLTIPT_CLASSES} data-tip={tooltip}>
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
        className="absolute left-0 top-0 w-full cursor-pointer opacity-0"
        id={id}
        value={value}
        title="Choose your color"
        onChange={(e) => onClick(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

const ActionDropdown = ({
  tooltip,
  selected,
  disabled,
  children,
  buttonChildren,
}: Omit<ActionButtonProps, "onClick"> & {
  buttonChildren: React.ReactNode;
}) => {
  return (
    <div className="dropdown dropdown-hover">
      <label
        tabIndex={0}
        className={cn(
          "btn btn-sm btn-ghost",
          disabled && "btn-disabled",
          selected && "btn-active"
        )}
        data-tip={tooltip}
      >
        {buttonChildren}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu shadow bg-base-100 rounded w-32"
      >
        {children}
      </ul>
    </div>
  );
};

const ActionDropdownItem = ({
  onClick,
  children,
  selected,
}: {
  onClick: () => void;
  children: React.ReactNode;
  selected?: boolean;
}) => {
  return (
    <li>
      <a className={cn("btn-sm", selected && "btn-active")} onClick={onClick}>
        {children}
      </a>
    </li>
  );
};

const ActionDivider = () => {
  return <div className="border-r border-base-content h-8 mx-2" />;
};

function useId() {
  const [id] = React.useState(() => Math.random().toString(36).substr(2, 9));
  return id;
}
