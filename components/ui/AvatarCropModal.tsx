"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ButtonLoader } from "@/components/ui/ButtonLoader";

interface AvatarCropModalProps {
  file: File | null;
  onComplete: (blob: Blob) => void;
  onCancel: () => void;
}

function getCroppedImg(imageSrc: string, crop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        256,
        256
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create image blob"));
        },
        "image/png"
      );
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = imageSrc;
  });
}

export function AvatarCropModal({
  file,
  onComplete,
  onCancel,
}: AvatarCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read file on mount
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsCropping(true);
    setError(null);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onComplete(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to crop image.");
    } finally {
      setIsCropping(false);
    }
  }

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-auto flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-black dark:text-white">Crop avatar</h3>

        <div className="relative w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
          {isCropping && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Spinner />
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-400">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-black dark:accent-white"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isCropping}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isCropping || !imageSrc}
            className="flex-1"
          >
            {isCropping ? <ButtonLoader label="Cropping…" onDark /> : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
