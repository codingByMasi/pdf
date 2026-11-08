// Sign PDF screen: make a signature, then place it on the page, move it and make it bigger or smaller.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { makeImage } from '../overlay/overlayModel.js';
import OverlayToolScreen from '../overlay/OverlayToolScreen.jsx';
import { SignatureMaker } from './SignatureMaker.jsx';

export default function SignTool({ tool }) {
  const { t } = useI18n();
  const [signature, setSignature] = useState(null);

  const extra = (api) => (
    <Button
      disabled={!signature}
      onClick={() => {
        const w = 0.28;
        const h = w * signature.aspect;
        api.addCentered((x, y) => makeImage(x, y, w, h, signature.bytes, signature.mime, signature.url), w, h);
      }}
    >
      {t('sign.place')}
    </Button>
  );

  return (
    <OverlayToolScreen
      tool={tool}
      tools={['select']}
      addText
      suffix="-signed"
      before={<SignatureMaker onReady={setSignature} />}
      extra={extra}
    />
  );
}
