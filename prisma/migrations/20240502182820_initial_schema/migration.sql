-- CreateTable
CREATE TABLE "UserSettings" (
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Category" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryIcon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthHistory" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MonthHistory_pkey" PRIMARY KEY ("userId","day","month","year")
);

-- CreateTable
CREATE TABLE "YearHistory" (
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "YearHistory_pkey" PRIMARY KEY ("userId","month","year")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_type_key" ON "Category"("userId", "name", "type");
