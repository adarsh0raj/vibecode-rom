"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, imageName }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-1 rounded-2xl overflow-hidden bg-background/95 backdrop-blur-sm romantic-shadow">
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={imageUrl}
            alt={imageName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="p-3">
          <h3 className="text-lg font-medium text-primary">{imageName}</h3>
        </div>
      </DialogContent>
    </Dialog>
  );
}