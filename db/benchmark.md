# Benchmark Base de données : PostgreSQL vs MongoDB vs MariaDB

## Tableau comparatif

| Critère                     | PostgreSQL                                     | MongoDB                                       | MariaDB                                       |
| --------------------------- | ---------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **Type**                    | Relationnelle (SQL)                            | NoSQL (document-oriented)                     | Relationnelle (SQL, fork de MySQL)            |
| **Performance brute**       | Très bonne, surtout pour requêtes complexes    | Excellente pour lecture/écriture massives     | Bonne, optimisée pour requêtes simples        |
| **Scalabilité**             | Verticale et horizontale (avec extensions)     | Excellente (sharding, réplication native)     | Bonne mais moins avancée que MongoDB          |
| **Flexibilité des données** | Schéma strict, mais support JSON/JSONB         | Très flexible (documents sans schéma)         | Schéma SQL classique, peu de flexibilité      |
| **Transactions**            | ACID complet                                   | Transactions multi-documents limitées         | ACID complet                                  |
| **Écosystème**              | Riche (PostGIS, TimescaleDB, extensions)       | Large (outils big data, BI, intégrations)     | Large (compatibilité MySQL, nombreux outils)  |
| **Courbe d’apprentissage**  | Moyenne (SQL avancé, nombreuses fonctions)     | Moyenne (paradigme document différent du SQL) | Faible si déjà familier avec MySQL            |
| **Cas d’usage typique**     | Applications critiques, analyses complexes, BI | Big Data, IoT, logs, applications flexibles   | Applications web classiques, remplaçant MySQL |

---

## Conclusion

- **PostgreSQL**

  - Point fort : très robuste, riche en fonctionnalités (ACID, extensions comme PostGIS), idéal pour applications critiques et analyses avancées.
  - Point faible : plus complexe à administrer et optimiser que MariaDB.

- **MongoDB**

  - Point fort : flexibilité et scalabilité excellentes, parfaitement adapté aux environnements Big Data et données non structurées.
  - Point faible : gestion des transactions moins robuste que les bases SQL traditionnelles.

- **MariaDB**
  - Point fort : simplicité, compatibilité avec MySQL, bonne performance pour les applications web standards.
  - Point faible : moins riche en fonctionnalités avancées et moins adapté aux gros volumes de données non structurées.
