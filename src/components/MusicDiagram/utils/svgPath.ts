export interface Point {
  x: number;
  y: number;
}

export function buildCubicBezierPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    d += ` C ${mx},${pts[i].y} ${mx},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
  }
  return d;
}

export function buildFillPath(strokePath: string, pts: Point[], H: number): string {
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${strokePath} L ${last.x},${H} L ${first.x},${H} Z`;
}
