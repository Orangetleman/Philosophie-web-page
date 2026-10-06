/* Fiche de l'auteur Sextus Empiricus (métadonnées : bio, courant, période, thèmes, dialogues).
   Le nom doit être EXACTEMENT celui employé dans les notions (champ n). */
AUTEUR("Sextus Empiricus", {
  bio: "Médecin et philosophe grec (v. 160–210), principal témoin du <strong>scepticisme pyrrhonien</strong>. Ses <em>Esquisses pyrrhoniennes</em> exposent les « tropes » (modes) qui mènent à la <strong>suspension du jugement</strong> (<em>épochè</em>) : faute de pouvoir trancher entre thèses opposées, le sceptique s'abstient — et y gagne la tranquillité de l'âme (<em>ataraxie</em>).",
  courant: "Scepticisme",
  periode: "Antiquité grecque",
  naissance: 160,
  mort: 210,
  datesApprox: true,
  themes: ["scepticisme", "tropes d'Agrippa", "suspension du jugement", "époché", "ataraxie"],
  dialogues: [
    {
      dir: "oppose",
      auteur: "Aristote",
      sujet: "la certitude des principes",
      desc: "Aristote fonde la science sur des principes premiers, certains par eux-mêmes ; Sextus objecte la régression à l'infini (tout fondement en réclame un autre) et le cercle (diallèle) — d'où la suspension du jugement.",
    },
    {
      dir: "oppose",
      auteur: "Descartes",
      sujet: "le doute",
      desc: "Le doute sceptique est un point d'arrêt (on suspend l'assentiment) ; le doute cartésien, lui, est méthodique et provisoire — un moyen d'atteindre une première certitude (le cogito).",
    },
  ],
});
