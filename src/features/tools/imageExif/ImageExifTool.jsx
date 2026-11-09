// Remove Photo Data screen: shows what hidden data a JPG has (camera, date, GPS place) and saves a clean copy without it.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage, formatOf } from '../../../shared/lib/imageIO.js';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { readExif } from '../imageKit/exifInfo.js';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';

function ExifReport({ file }) {
  const { t } = useI18n();
  const [info, setInfo] = useState(null);
  useEffect(() => {
    let live = true;
    file.slice(0, 262144).arrayBuffer().then((buffer) => { if (live) setInfo(readExif(new Uint8Array(buffer))); });
    return () => { live = false; };
  }, [file]);
  if (!info) return null;
  if (!info.hasExif) return <p>{t('exif.none')}</p>;
  return (
    <ul className="plain-list">
      <li>{info.hasGps ? t('exif.gpsYes') : t('exif.gpsNo')}</li>
      {info.camera ? <li>{t('exif.camera', { camera: info.camera })}</li> : null}
      {info.taken ? <li>{t('exif.taken', { date: info.taken })}</li> : null}
    </ul>
  );
}

export default function ImageExifTool({ tool }) {
  const run = async ({ file, image }) => {
    const format = keepFormat(formatOf(file));
    return imageResult(file, '-clean', await canvasToFile(drawImage(image, image.width, image.height, format === 'jpg' ? '#ffffff' : null), format, 0.95), { noteKey: 'exif.done' });
  };
  return <ImageEditScreen tool={tool} run={run}>{(image, file) => <ExifReport file={file} />}</ImageEditScreen>;
}
