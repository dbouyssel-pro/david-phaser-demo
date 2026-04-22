# Agents de Développement Automatisé

Ce dossier contient un système d'agents orchestrés pour automatiser le cycle complet de développement de features, de la planification au déploiement.

## Architecture du Système

Le système est composé de **6 agents spécialisés** et **2 orchestrateurs** travaillant ensemble :

### Option 1 : Feature Flow (Workflow Complet)
```
┌─────────────────────────────────────────────────────────────────┐
│                      Feature Flow                                │
│                (Orchestrateur Complet)                           │
│                   user-invocable: true                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─ Invoke ──┐
                              │            │
        ┌─────────────────────┼────────────┼────────────┬──────────┤
        │                     │            │            │          │
        ▼                     ▼            ▼            ▼          ▼
  ┌──────────┐         ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Feature  │         │Developer │  │ PR       │  │ PR       │  │Deployer  │
  │ Planner  │         │          │  │ Creator  │  │ Reviewer │  │          │
  └──────────┘         └──────────┘  └──────────┘  └──────────┘  └──────────┘
       │                    ▲              │             ▲              │
       └─► Plan ─►──────────┤              │             │              │
                            │              │             │              │
                            ▼              ▼             │              │
                       ┌──────────┐   ┌──────────┐      │              │
                       │    QA    │◄──┤ Feedback │      │              │
                       │ Analyst  │   │  Loop    │      │              │
                       └──────────┘   └──────────┘      │              │
                            │                            │              │
                            └─► Approve ────►────────────┴─► Merge ────┘
```

### Option 2 : Quick Flow (Workflow Rapide)
```
┌─────────────────────────────────────────────────────────────────┐
│                      Quick Flow                                  │
│               (Orchestrateur Simplifié)                          │
│                   user-invocable: true                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─ Invoke ──┐
                              │            │
        ┌─────────────────────┼────────────┤
        │                     │            │
        ▼                     ▼            ▼
  ┌──────────┐         ┌──────────┐  ┌──────────────┐
  │ Feature  │         │Developer │  │ Direct       │
  │ Planner  │         │          │  │ Commit       │
  └──────────┘         └──────────┘  │ (no PR)      │
       │                    ▲         └──────────────┘
       └─► Plan ─►──────────┤              ▲
                            │              │
                            ▼              │
                       ┌──────────┐   ┌──────────┐
                       │    QA    │◄──┤ Feedback │
                       │ Analyst  │   │  Loop    │
                       └──────────┘   └──────────┘
                            │
                            └─► Approve ────► Commit ────┘
```

## Les Agents

### 1. **Feature Planner** ([plan-feature.agent.md](plan-feature.agent.md))
- **Rôle** : Analyse les besoins et crée un plan de développement détaillé
- **Outils** : `read`, `search`
- **Invocable** : Non (uniquement via orchestrateur)

### 2. **Developer** ([developer.agent.md](developer.agent.md))
- **Rôle** : Implémente les features selon le plan ou corrige selon feedback QA
- **Outils** : `read`, `edit`, `search`
- **Invocable** : Non (uniquement via orchestrateur)

### 3. **QA Analyst** ([qa-analyst.agent.md](qa-analyst.agent.md))
- **Rôle** : Revue de code, tests de régression, identification de bugs
- **Outils** : `read`, `search`, `execute`
- **Invocable** : Non (uniquement via orchestrateur)
- **Particularité** : Peut rejeter et renvoyer au Developer (boucle de feedback)

### 4. **PR Creator** ([pr-creator.agent.md](pr-creator.agent.md))
- **Rôle** : Crée la branche, commit les changements, génère la description de PR
- **Outils** : `read`, `search`, `execute`
- **Invocable** : Non (uniquement via orchestrateur)

### 5. **PR Reviewer** ([pr-reviewer.agent.md](pr-reviewer.agent.md))
- **Rôle** : Valide la qualité de la PR (description, commits, git hygiene)
- **Outils** : `read`, `search`, `execute`
- **Invocable** : Non (uniquement via orchestrateur)
- **Particularité** : Peut rejeter et renvoyer au PR Creator (boucle de feedback)

### 6. **Deployer** ([deployer.agent.md](deployer.agent.md))
- **Rôle** : Merge la PR, déclenche le déploiement GitHub Pages, vérifie le succès
- **Outils** : `read`, `execute`
- **Invocable** : Non (uniquement via orchestrateur)

### 7. **Feature Flow (Orchestrator)** ([orchestrator.agent.md](orchestrator.agent.md))
- **Rôle** : Coordonne tous les agents pour un workflow complet avec PR et déploiement
- **Outils** : `agent` (peut invoquer les autres agents)
- **Invocable** : **OUI**
- **Workflow** : Planning → Dev → QA → PR Creation → PR Review → Deployment

### 8. **Quick Flow (Orchestrator Simplifié)** ([quick-flow.agent.md](quick-flow.agent.md))
- **Rôle** : Workflow rapide sans PR ni revue - commit direct
- **Outils** : `agent`, `execute`
- **Invocable** : **OUI**
- **Workflow** : Planning → Dev → QA → Direct Commit
- **⚡ Use case** : Quand on est pressé, prototypage, petites features

## Workflows Disponibles

### Workflow Feature Flow (Complet)

```
1. Planning
   └─► Feature Planner crée le plan

2. Development
   └─► Developer implémente le plan

3. Quality Assurance (avec boucle)
   ├─► QA Analyst revoit le code et teste
   ├─► Si CHANGES REQUIRED:
   │   ├─► Developer corrige
   │   └─► Retour à QA Analyst
   └─► Si APPROVED: continuer

4. PR Creation
   └─► PR Creator crée la branche et la PR

5. PR Review (avec boucle)
   ├─► PR Reviewer valide la PR
   ├─► Si CHANGES REQUIRED:
   │   ├─► PR Creator corrige
   │   └─► Retour à PR Reviewer
   └─► Si APPROVED: continuer

6. Deployment
   └─► Deployer merge et déploie sur GitHub Pages
```

### Workflow Quick Flow (Rapide)

```
1. Planning
   └─► Feature Planner crée le plan

2. Development
   └─► Developer implémente le plan

3. Quality Assurance (avec boucle)
   ├─► QA Analyst revoit le code et teste
   ├─► Si CHANGES REQUIRED:
   │   ├─► Developer corrige
   │   └─► Retour à QA Analyst
   └─► Si APPROVED: continuer

4. Direct Commit
   └─► Orchestrator commit directement sur la branche courante
   └─► Pas de PR, pas de review, pas de déploiement
```

## Boucles de Feedback

### Boucle QA ↔ Developer
- **Déclencheur** : QA Analyst trouve des problèmes
- **Action** : Developer reçoit les issues et corrige
- **Itération** : Jusqu'à approbation complète du QA
- **Limite** : Max 5 itérations (escalade ensuite)

### Boucle PR Reviewer ↔ PR Creator
- **Déclencheur** : PR Reviewer trouve des problèmes de qualité de PR
- **Action** : PR Creator corrige (description, commits, etc.)
- **Itération** : Jusqu'à approbation complète du reviewer
- **Limite** : Max 3 itérations (escalade ensuite)

## Utilisation

### Pour l'utilisateur humain

Vous pouvez invoquer l'un des deux orchestrateurs selon vos besoins :

#### Option 1 : Feature Flow (Workflow complet)
```
@workspace /invoke Feature Flow

"Ajouter un système de power-ups dans le jeu"
```
**Quand l'utiliser :**
- ✅ Développement en équipe
- ✅ Features importantes nécessitant review
- ✅ Déploiement sur GitHub Pages requis
- ✅ Workflow PR standard

#### Option 2 : Quick Flow (Workflow rapide)
```
@workspace /invoke Quick Flow

"Ajouter un système de power-ups dans le jeu"
```
**Quand l'utiliser :**
- ⚡ Besoin de livrer vite
- ⚡ Petites features ou bug fixes
- ⚡ Développement solo
- ⚡ Prototypage ou expérimentation
- ⚡ Commits directs acceptables

### Ce que fait chaque orchestrateur

**Feature Flow :**
1. Analyse votre demande
2. Invoque les agents dans le bon ordre
3. Gère les boucles de feedback automatiquement
4. Crée une PR et la fait reviewer
5. Merge et déploie sur GitHub Pages
6. Vous donne l'URL finale de déploiement

**Quick Flow :**
1. Analyse votre demande
2. Invoque Planning → Dev → QA
3. Gère la boucle de feedback QA ↔ Dev
4. Commit directement (pas de PR)
5. Vous laisse le contrôle pour push quand vous voulez

## Sécurités

- **Aucun agent n'est invocable directement** sauf l'orchestrateur
- **Limites d'itérations** pour éviter les boucles infinies
- **Validation stricte** à chaque étape (QA et PR Review)
- **Escalade à l'humain** si problèmes insurmontables

## Restrictions d'outils

Chaque agent a accès uniquement aux outils dont il a besoin :

| Agent | read | edit | search | execute | agent |
|-------|------|------|--------|---------|-------|
| Feature Planner | ✅ | ❌ | ✅ | ❌ | ❌ |
| Developer | ✅ | ✅ | ✅ | ❌ | ❌ |
| QA Analyst | ✅ | ❌ | ✅ | ✅ | ❌ |
| PR Creator | ✅ | ❌ | ✅ | ✅ | ❌ |
| PR Reviewer | ✅ | ❌ | ✅ | ✅ | ❌ |
| Deployer | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Feature Flow** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Quick Flow** | ❌ | ❌ | ❌ | ✅ | ✅ |

## Exemple de Session

```
User: @workspace /invoke Feature Flow
      "Ajouter un système de vies pour le joueur"

Orchestrator:
🚀 Starting feature development workflow

📋 Stage 1: Planning...
✅ Plan created with 5 tasks

💻 Stage 2: Development...
✅ Development complete - 3 files modified

🔍 Stage 3: Quality Assurance...
🔄 QA Iteration 1: Changes requested
   - Missing error handling in player.ts
   - Tests need to cover edge case
💻 Developer fixing issues...
🔍 QA Iteration 2: Review...
✅ QA approved!

📝 Stage 4: PR Creation...
✅ PR created in branch: feature/player-lives

👀 Stage 5: PR Review...
✅ PR approved!

🚀 Stage 6: Deployment...
✅ Merged to main
✅ GitHub Actions triggered
✅ Deployed successfully

🎉 Feature deployed successfully!
🌐 Live at: https://username.github.io/repo/
```

## Maintenance

Pour modifier le comportement des agents :
1. Éditez le fichier `.agent.md` correspondant
2. Modifiez les instructions dans le corps du fichier
3. Les changements sont pris en compte immédiatement

Pour ajouter un nouvel agent :
1. Créez un nouveau fichier `.agent.md`
2. Définissez le frontmatter avec `description`, `tools`, etc.
3. Ajoutez-le à la liste `agents:` de l'orchestrateur si nécessaire
