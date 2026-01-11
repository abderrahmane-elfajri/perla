# Beauté Élégance — Centre de Beauté (Template Luxe + 3D)

Un site web **professionnel**, **mobile-first** et **haut de gamme** pour un centre de beauté, avec un univers luxe (or / rose gold / bordeaux) et des **éléments 3D** (Three.js).

## ✨ Points forts

- **Design mobile-first** : optimisé d’abord pour le téléphone, puis pour tablette et desktop
- **Esthétique premium** : surfaces « glass », dégradés luxe, typographies élégantes
- **3D (Three.js)** : arrière‑plan 3D fluide + vitrine 3D interactive dans la galerie
- **Galerie avant / après** : comparaison glissable (touch-friendly)
- **Animations douces** : révélations au scroll, micro‑interactions, cartes 3D (tilt)
- **Accessibilité** : lien “skip”, focus visibles, prise en compte de `prefers-reduced-motion`

## 🧩 Sections

1. **Header / Navigation** : menu sticky, hamburger animé (mobile)
2. **Hero** : introduction premium + **arrière‑plan 3D**
3. **Services** : cartes responsives, hover/tilt
4. **Galerie 3D** : avant/après + vitrine 3D rotative
5. **Pourquoi nous** : bénéfices / différenciants
6. **Contact** : infos, formulaire, **carte** (OpenStreetMap)
7. **Footer** : liens rapides + réseaux sociaux

## 🎨 Palette de couleurs (luxe beauté)

- Or : `#D4A574`
- Rose gold : `#E8B4A8`
- Beige : `#F5E6D3`
- Cream : `#FFF9F5`
- Bordeaux : `#8B4C5C`
- Texte : `#2C2C2C`

Toutes les couleurs sont centralisées dans `styles.css` via des variables CSS (`:root`).

## 🧱 Stack & dépendances

- **HTML5 / CSS3 / JavaScript**
- **Three.js** (chargé via CDN)
- **Google Fonts** (Inter + Playfair Display)

> Le site est prêt à déployer tel quel. Si vous souhaitez un mode 100% offline, remplacez les CDN par des fichiers locaux.

## 🚀 Utilisation

1. Ouvrez `index.html` dans votre navigateur.
2. Hébergez le dossier tel quel sur votre hébergeur (Netlify, Vercel, GitHub Pages, etc.).

## ✏️ Personnalisation rapide

### Ajouter votre logo
Dans `index.html`, remplacez le bloc `.nav__logo-placeholder` :

```html
<img src="votre-logo.png" alt="Logo Beauté Élégance" />
```

### Images avant / après
Dans la section `#galerie`, remplacez les URLs des images Unsplash par vos images.

### Informations de contact
Dans `#contact`, modifiez :
- Adresse
- Téléphone
- Email
- Horaires

### Couleurs / typographies
- Couleurs : variables CSS dans `:root` (`styles.css`)
- Fonts : imports dans `<head>` et variables `--body-font` / `--title-font`

## 📁 Structure des fichiers

```
/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 📝 Licence

Template libre d'utilisation pour votre centre de beauté.
