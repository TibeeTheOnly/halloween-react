# Halloween React (React + TypeScript + Vite)

Ez egy egyszerű React + TypeScript (Vite) alkalmazás, amely segít nyilvántartani, hogy mely házaknál van még édesség Halloween idején.

Funkciók röviden
- Házak listázása
- Édesség-készlet státusz frissítése (van/üres)
- Új ház hozzáadása (allergén-információval)

Gyors indítás
1. Telepítés:

   npm install

2. Fejlesztői szerver indítása:

   npm run dev

3. Éles build készítése:

   npm run build

Környezeti változók
- A projekt a `VITE_API_BASE_URL` környezeti változót használja az API alapcíméhez. Például:

  VITE_API_BASE_URL=http://localhost:3000/houses

Fájlok
- `src/api.ts` — API hívások
- `src/types.ts` — típusdefiníciók
- `src/App.tsx` — fő komponens
- `src/components/*` — alkomponensek

Ha szeretnéd, segítek i18n bevezetésében, hogy a felhasználói felület több nyelvet is támogasson futásidőben.

---
Készen állsz, hogy tovább fordítsam az esetleges többi angol szöveget is, vagy szeretnél i18n megoldást bevezetni?
