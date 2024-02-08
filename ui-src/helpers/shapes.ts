export const createCircle = (fill: string, stroke: string) => ({
  radius: 100,
  left: 100,
  top: 100,
  fill,
  stroke
});

export const createRectangle = (fill: string, stroke: string) => ({
  left: 100,
  top: 100,
  fill,
  stroke,
  width: 200,
  height: 200,
  angle: 0
});

export const createLine = (stroke: string) => ({
  points: [50, 100, 200, 200],
  options: {
    left: 170,
    top: 150,
    stroke
  }
});

export const createText = (stroke: string) => ({
  type: 'text',
  left: 100,
  top: 100,
  fontSize: 16,
  fontFamily: 'Arial',
  fill: stroke
});
