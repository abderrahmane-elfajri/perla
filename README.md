# Beauté Élégance - Centre de Beauté Portfolio

Un site web professionnel, mobile-first, pour un centre de beauté avec du contenu en français et des animations fluides.

## 🎨 Caractéristiques

- **Design Mobile-First** : Optimisé d'abord pour les téléphones, puis pour les tablettes et ordinateurs
- **Design Professionnel** : Esthétique élégante et propre adaptée à l'industrie de la beauté
- **Animations Fluides** : Transitions douces, effets de fondu, et animations au survol
- **Contenu en Français** : Tout le contenu est en français professionnel
- **Responsive** : S'adapte parfaitement à toutes les tailles d'écran
- **Léger** : Aucune dépendance externe requise

## 📱 Sections du Site

1. **Header** : Navigation avec espace pour logo (à personnaliser)
2. **Hero** : Section d'introduction professionnelle
3. **Services** : Présentation des services avec cartes animées
   - Soins du Visage
   - Maquillage Professionnel
   - Manucure & Pédicure
   - Épilation
   - Massage & Bien-être
   - Extension de Cils
4. **Portfolio** : Galerie de réalisations avec effets au survol
5. **Contact** : Informations de contact et formulaire
6. **Footer** : Pied de page professionnel avec liens sociaux

## 🎨 Palette de Couleurs

- **Couleur Primaire** : #d4a574 (Or élégant)
- **Couleur Secondaire** : #f5e6d3 (Beige clair)
- **Couleur Accent** : #c9a882 (Or doux)
- **Texte Foncé** : #2c2c2c
- **Texte Clair** : #666666
- **Fond Clair** : #faf8f5

## 🚀 Installation et Utilisation

1. **Ouvrir le site** : Ouvrez simplement le fichier `index.html` dans votre navigateur
2. **Hébergement** : Téléchargez les fichiers sur votre hébergeur web
3. **Personnalisation** : Voir la section ci-dessous

## ✏️ Personnalisation

### Ajouter Votre Logo
1. Remplacez le contenu de `.nav__logo-placeholder` dans le header
2. Ajoutez votre image logo : `<img src="votre-logo.png" alt="Logo">`

### Modifier les Images du Portfolio
Remplacez les URLs des images dans `index.html` par vos propres images :
```html
<img src="chemin/vers/votre-image.jpg" alt="Description">
```

### Modifier les Informations de Contact
Dans la section `#contact`, modifiez :
- L'adresse
- Le numéro de téléphone
- L'email
- Les horaires d'ouverture

### Modifier les Services
Éditez la section `.services__grid` pour :
- Ajouter/supprimer des services
- Modifier les descriptions
- Changer les prix

### Personnaliser les Couleurs
Dans `styles.css`, modifiez les variables CSS dans `:root` :
```css
:root {
    --primary-color: #votre-couleur;
    --secondary-color: #votre-couleur;
    /* etc. */
}
```

## 📱 Navigation Mobile

- Menu hamburger sur mobile
- Navigation fluide entre les sections
- Animation de transition pour le menu

## ✨ Animations Incluses

- **Fade In** : Apparition progressive
- **Slide Up** : Montée depuis le bas
- **Slide Left/Right** : Glissement latéral
- **Scale** : Effet d'agrandissement
- **Hover Effects** : Effets au survol
- **Parallax** : Effet de profondeur sur le hero

## 🌐 Compatibilité Navigateur

- Chrome (recommandé)
- Firefox
- Safari
- Edge
- Opera
- Navigateurs mobiles (iOS Safari, Chrome Android)

## 📄 Structure des Fichiers

```
/
├── index.html       # Page principale
├── styles.css       # Feuille de style
├── script.js        # JavaScript pour interactivité
└── README.md        # Ce fichier
```

## 🎯 Optimisations Incluses

- Images optimisées avec Unsplash
- CSS optimisé pour les performances
- JavaScript minimal et efficace
- Animations CSS plutôt que JavaScript
- Mobile-first pour chargement rapide
- Pas de dépendances externes

## 📞 Support

Pour personnaliser davantage le site, vous pouvez :
1. Modifier le HTML pour le contenu
2. Ajuster le CSS pour le style
3. Étendre le JavaScript pour plus d'interactivité

## 🔄 Mise à Jour du Contenu

1. **Textes** : Modifiez directement dans `index.html`
2. **Styles** : Ajustez dans `styles.css`
3. **Fonctionnalités** : Étendez dans `script.js`

## 📝 Licence

Ce template est libre d'utilisation pour votre centre de beauté.

---

**Fait avec ❤️ pour votre succès dans l'industrie de la beauté**
