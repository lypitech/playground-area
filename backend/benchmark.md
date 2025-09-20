# Benchmark Backend : FastAPI vs NestJS vs Go

## Tableau comparatif

| Critère                    | FastAPI (Python)                                 | NestJS (Node.js/TS)                               | Go (Golang)                                     |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------- |
| **Langage**                | Python                                           | TypeScript / JavaScript                           | Go                                              |
| **Performance brute**      | Moyenne (interpréteur Python, dépend de uvicorn) | Bonne (Node.js + TypeScript, scalable)            | Excellente (compilé, proche du C en perf)       |
| **Facilité de dev**        | Très élevée (syntaxe claire, peu de code)        | Moyenne à élevée (structure MVC, décorateurs)     | Moyenne (syntaxe simple mais plus bas niveau)   |
| **Écosystème**             | Riche (IA, data science, web, ORM SQLAlchemy)    | Large (npm, front/back, libs modernes)            | Correct (standard lib solide, mais plus limité) |
| **Courbe d’apprentissage** | Faible pour Pythonistes                          | Moyenne (TypeScript + concepts Nest)              | Moyenne (simplicité, mais paradigme différent)  |
| **Scalabilité**            | Limité par Python GIL, mais bon pour API I/O     | Bonne (orienté microservices, support websockets) | Très bonne (conçu pour la concurrence native)   |
| **Communauté**             | Grande (surtout orientée data/IA)                | Grande (adossée à l’écosystème JS)                | Grande et très active (surtout DevOps/backend)  |
| **ORM / DB intégration**   | SQLAlchemy, Tortoise, Prisma (moins mature)      | TypeORM, Prisma, Mongoose (très mature)           | GORM, sqlx (bons mais plus bas niveau)          |
| **Cas d’usage typique**    | APIs rapides à prototyper, intégration ML/IA     | Applications web complètes, microservices Node    | Services haute perf, systèmes distribués        |

---

## Conclusion

- **FastAPI**

  - **Point fort** : rapidité de développement, simplicité, parfait pour exposer des APIs (surtout dans un contexte **IA/data science**).
  - **Point faible** : performances et scalabilité limitées par Python (GIL).

- **NestJS**

  - **Point fort** : structure claire, écosystème riche (npm, TypeORM, Prisma), très adapté aux **applications web complètes** et microservices.
  - **Point faible** : complexité initiale (apprentissage TypeScript + architecture imposée).

- **Go**
  - **Point fort** : **performances excellentes** et gestion native de la concurrence, idéal pour systèmes distribués et **backend haute charge**.
  - **Point faible** : écosystème moins fourni pour le web, plus de code à écrire qu’avec FastAPI ou NestJS.
