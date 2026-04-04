import { motion } from "motion/react";
import Link from "next/link";
import { memo } from "react";

import BlurImage from "@/components/ui/blur-image";

type HeaderBrandProps = {
  onNavigate: () => void;
};

function HeaderBrand({ onNavigate }: HeaderBrandProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ scale: 1.06, rotate: -6 }}
      whileTap={{ scale: 0.94, rotate: 0 }}
      className="flex size-full items-center justify-center"
    >
      <Link
        href="/"
        transitionTypes={["page"]}
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        className="flex size-full items-center justify-center"
        onClick={onNavigate}
      >
        <BlurImage
          src="/brand/logo.svg"
          alt="My App"
          width={28}
          height={28}
          draggable={false}
          eager
          wrapperClassName="inline-flex h-7 w-7"
          className="h-7 w-7 object-contain"
        />
      </Link>
    </motion.div>
  );
}

export default memo(HeaderBrand);
