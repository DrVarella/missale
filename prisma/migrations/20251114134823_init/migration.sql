-- CreateTable
CREATE TABLE "MultiLangText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pt" TEXT NOT NULL,
    "es" TEXT NOT NULL,
    "la" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "de" TEXT NOT NULL,
    "it" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Mass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "season" TEXT,
    "rank" TEXT NOT NULL,
    "color" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "firstReadingRef" TEXT,
    "firstReadingText" TEXT,
    "psalmRef" TEXT,
    "psalmText" TEXT,
    "secondReadingRef" TEXT,
    "secondReadingText" TEXT,
    "gospelRef" TEXT NOT NULL,
    "gospelText" TEXT,
    "alleluiaVerse" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Preface" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "textId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Preface_textId_fkey" FOREIGN KEY ("textId") REFERENCES "MultiLangText" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EucharisticPrayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "number" INTEGER,
    "textId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EucharisticPrayer_textId_fkey" FOREIGN KEY ("textId") REFERENCES "MultiLangText" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "primaryLanguage" TEXT NOT NULL DEFAULT 'la',
    "secondaryLanguage" TEXT,
    "fontSize" INTEGER NOT NULL DEFAULT 16,
    "fontFamily" TEXT NOT NULL DEFAULT 'serif',
    "showRubrics" BOOLEAN NOT NULL DEFAULT true,
    "showBackground" BOOLEAN NOT NULL DEFAULT false,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "textPresentation" TEXT NOT NULL DEFAULT 'sideBySide',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "massId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Mass_code_key" ON "Mass"("code");

-- CreateIndex
CREATE INDEX "Mass_category_idx" ON "Mass"("category");

-- CreateIndex
CREATE INDEX "Mass_season_idx" ON "Mass"("season");

-- CreateIndex
CREATE INDEX "Mass_rank_idx" ON "Mass"("rank");

-- CreateIndex
CREATE INDEX "Mass_month_day_idx" ON "Mass"("month", "day");

-- CreateIndex
CREATE INDEX "Mass_searchText_idx" ON "Mass"("searchText");

-- CreateIndex
CREATE UNIQUE INDEX "Reading_code_key" ON "Reading"("code");

-- CreateIndex
CREATE INDEX "Reading_code_idx" ON "Reading"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Preface_code_key" ON "Preface"("code");

-- CreateIndex
CREATE INDEX "Preface_code_idx" ON "Preface"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EucharisticPrayer_code_key" ON "EucharisticPrayer"("code");

-- CreateIndex
CREATE INDEX "EucharisticPrayer_code_idx" ON "EucharisticPrayer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_massId_key" ON "Bookmark"("userId", "massId");
