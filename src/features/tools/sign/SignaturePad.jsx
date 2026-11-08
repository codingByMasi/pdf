// A box to draw a signature in with a finger, pen or mouse.
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';

export function SignaturePad({ color, onChange }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const last = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const context = ref.current.getContext('2d');
    context.lineWidth = 7;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
  }, [color]);

  const spot = (event) => {
    const box = ref.current.getBoundingClientRect();
    return [((event.clientX - box.left) / box.width) * ref.current.width, ((event.clientY - box.top) / box.height) * ref.current.height];
  };

  function down(event) {
    ref.current.setPointerCapture(event.pointerId);
    last.current = spot(event);
    const context = ref.current.getContext('2d');
    context.beginPath();
    context.moveTo(...last.current);
    context.lineTo(last.current[0] + 0.1, last.current[1]);
    context.stroke();
  }

  function move(event) {
    if (!last.current) return;
    const next = spot(event);
    const context = ref.current.getContext('2d');
    context.beginPath();
    context.moveTo(...last.current);
    context.lineTo(...next);
    context.stroke();
    last.current = next;
  }

  function up() {
    if (!last.current) return;
    last.current = null;
    setDrawn(true);
    onChange(ref.current);
  }

  function clear() {
    ref.current.getContext('2d').clearRect(0, 0, ref.current.width, ref.current.height);
    setDrawn(false);
    onChange(null);
  }

  return (
    <div className="signature-pad">
      <canvas
        ref={ref}
        className="signature-canvas"
        width="1200"
        height="400"
        role="img"
        aria-label={t('sign.padLabel')}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
      <Button variant="secondary" disabled={!drawn} onClick={clear}>{t('sign.clear')}</Button>
    </div>
  );
}
