import type { InstrumentGroup } from '../types';

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function drawStereoField(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  groups: InstrumentGroup[],
  si: number,
  freqColors: Record<string, string>,
): void {
  ctx.clearRect(0, 0, W, H);

  const screenGrad = ctx.createLinearGradient(0, 0, 0, H);
  screenGrad.addColorStop(0, '#d9d5d0');
  screenGrad.addColorStop(0.5, '#e3e0dc');
  screenGrad.addColorStop(1, '#d4d0ca');
  ctx.fillStyle = screenGrad;
  ctx.fillRect(0, 0, W, H);

  const nL = 8, nR = W - 8;
  const fL = W * 0.22, fR = W * 0.78;
  const yNear = H - 22, yFar = 12;

  const floorGrad = ctx.createLinearGradient(0, yFar, 0, yNear);
  floorGrad.addColorStop(0, 'rgba(0,0,0,0)');
  floorGrad.addColorStop(1, 'rgba(0,0,0,0.03)');
  ctx.beginPath();
  ctx.moveTo(nL, yNear); ctx.lineTo(fL, yFar);
  ctx.lineTo(fR, yFar); ctx.lineTo(nR, yNear);
  ctx.closePath();
  ctx.fillStyle = floorGrad;
  ctx.fill();

  const nDepth = 8;
  for (let i = 0; i <= nDepth; i++) {
    const t = i / nDepth;
    const y = lerp(yNear, yFar, t);
    const xl = lerp(nL, fL, t), xr = lerp(nR, fR, t);
    ctx.beginPath();
    ctx.moveTo(xl, y); ctx.lineTo(xr, y);
    const a = 0.12 - t * 0.06;
    ctx.strokeStyle = `rgba(0,0,0,${a > 0 ? a : 0.03})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const nVert = 10;
  for (let i = 0; i <= nVert; i++) {
    const t = i / nVert;
    const xN = lerp(nL, nR, t), xF = lerp(fL, fR, t);
    ctx.beginPath();
    ctx.moveTo(xN, yNear); ctx.lineTo(xF, yFar);
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(nL, yNear); ctx.lineTo(fL, yFar);
  ctx.lineTo(fR, yFar); ctx.lineTo(nR, yNear);
  ctx.closePath();
  ctx.strokeStyle = '#C0BCB6';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W / 2, yNear); ctx.lineTo(W / 2, yFar);
  ctx.strokeStyle = 'rgba(212,30,34,0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(90,88,84,0.6)';
  ctx.font = '8px DM Mono,monospace';
  ctx.textAlign = 'center';
  ctx.fillText('◄', nL + 2, yNear + 14);
  ctx.fillText('►', nR - 2, yNear + 14);

  const lx = W / 2, ly = yNear + 14;
  ctx.beginPath();
  ctx.moveTo(lx, yNear + 6);
  ctx.lineTo(lx - 5, ly + 5);
  ctx.lineTo(lx + 5, ly + 5);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(212,30,34,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(138,135,130,0.8)';
  ctx.font = '6px DM Mono,monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FUNDO DA MIX', W / 2, yFar - 2);

  const allInsts = groups.flatMap(g => g.instruments);

  allInsts.forEach(inst => {
    const d = inst.data[si];
    if (!d) return;
    const dyn = d.dyn ?? 0;
    const prom = inst.isVocal
      ? (('intensity' in d ? d.intensity : 0) ?? 0)
      : (('prom' in d ? d.prom : 0) ?? 0);
    if (dyn === 0 && prom === 0) return;

    const depth = prom;
    const t = 1 - depth;

    const y = lerp(yNear, yFar + 8, t);
    const xl = lerp(nL, fL, t), xr = lerp(nR, fR, t);
    const panT = (d.pan + 1) / 2;
    const x = lerp(xl, xr, panT);

    const baseR = 5 + dyn * 10;
    const r = baseR * lerp(1, 0.4, t);

    const color = freqColors[inst.freq] ?? '#ffffff';

    const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    grd.addColorStop(0, color + '40');
    grd.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color + 'dd';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const fs = Math.max(6, lerp(9, 6.5, t));
    ctx.font = `bold ${fs}px DM Mono,monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.globalAlpha = lerp(1, 0.65, t);
    ctx.fillText(inst.name.split(' ')[0], x, y - r - 3);
    ctx.globalAlpha = 1;
  });

  const vignette = ctx.createRadialGradient(
    W / 2, H / 2, Math.min(W, H) * 0.35,
    W / 2, H / 2, Math.max(W, H) * 0.7,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.14)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}
