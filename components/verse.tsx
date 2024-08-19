import { motion } from "framer-motion";


const Verse = () => {
  return (
    <div className="flex flex-col gap-2 items-center text-blue-200">
      <motion.span
        key={`arabic`}
        className="inline-block text-2xl font-light text-right"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            ease: "easeInOut",
            delay: 2,
            duration: 0.7,
          },
        }}
      >
        اَ لۡحَمۡدُ لِلّٰهِ الَّذِىۡۤ اَنۡزَلَ عَلٰى عَبۡدِهِ الۡكِتٰبَ وَلَمۡ يَجۡعَلْ لَّهٗ عِوَجًا  ؕ‏
      </motion.span>
      <motion.span
        key={`english`}
        className="inline-block text-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            ease: "easeInOut",
            delay: 2,
            duration: 1,
          },
        }}
      >
        All praise is for Allah Who has revealed the Book to His servant, allowing no crookedness in it.
      </motion.span>

    </div>
  );
}

export default Verse;
