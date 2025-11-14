-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "season" TEXT,
    "rank" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "precedence" INTEGER NOT NULL DEFAULT 10,
    "date" DATETIME,
    "month" INTEGER,
    "day" INTEGER,
    "titleId" TEXT NOT NULL,
    "entranceAntiphonId" TEXT,
    "collectId" TEXT,
    "prayerOverOfferingsId" TEXT,
    "communionAntiphonId" TEXT,
    "postCommunionId" TEXT,
    "readingsRef" TEXT,
    "prefaceRef" TEXT,
    "eucharisticPrayerRef" TEXT,
    "searchText" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Mass_titleId_fkey" FOREIGN KEY ("titleId") REFERENCES "MultiLangText" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mass_entranceAntiphonId_fkey" FOREIGN KEY ("entranceAntiphonId") REFERENCES "MultiLangText" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mass_collectId_fkey" FOREIGN KEY ("collectId") REFERENCES "MultiLangText" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mass_prayerOverOfferingsId_fkey" FOREIGN KEY ("prayerOverOfferingsId") REFERENCES "MultiLangText" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mass_communionAntiphonId_fkey" FOREIGN KEY ("communionAntiphonId") REFERENCES "MultiLangText" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Mass_postCommunionId_fkey" FOREIGN KEY ("postCommunionId") REFERENCES "MultiLangText" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Mass" ("category", "code", "collectId", "color", "communionAntiphonId", "createdAt", "date", "day", "entranceAntiphonId", "eucharisticPrayerRef", "id", "month", "postCommunionId", "prayerOverOfferingsId", "prefaceRef", "rank", "readingsRef", "searchText", "season", "tags", "titleId", "updatedAt") SELECT "category", "code", "collectId", "color", "communionAntiphonId", "createdAt", "date", "day", "entranceAntiphonId", "eucharisticPrayerRef", "id", "month", "postCommunionId", "prayerOverOfferingsId", "prefaceRef", "rank", "readingsRef", "searchText", "season", "tags", "titleId", "updatedAt" FROM "Mass";
DROP TABLE "Mass";
ALTER TABLE "new_Mass" RENAME TO "Mass";
CREATE UNIQUE INDEX "Mass_code_key" ON "Mass"("code");
CREATE INDEX "Mass_category_idx" ON "Mass"("category");
CREATE INDEX "Mass_season_idx" ON "Mass"("season");
CREATE INDEX "Mass_rank_idx" ON "Mass"("rank");
CREATE INDEX "Mass_month_day_idx" ON "Mass"("month", "day");
CREATE INDEX "Mass_searchText_idx" ON "Mass"("searchText");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
