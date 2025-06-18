-- CreateEnum
CREATE TYPE "PetAge" AS ENUM ('PUPPY', 'ADULT', 'OLD');

-- CreateEnum
CREATE TYPE "PetEnergyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH', 'CRAZY');

-- CreateEnum
CREATE TYPE "PetEnvironment" AS ENUM ('SPACIOUS', 'LIMITED', 'OUTDOOR', 'ANY');

-- CreateEnum
CREATE TYPE "PetIndependencyLevel" AS ENUM ('TOTALLY_INDEPENDENT', 'VERY_INDEPENDENT', 'FAIRLY_INDEPENDENT', 'SOMEWHAT_DEPENDENT', 'QUITE_DEPENDENT', 'VERY_DEPENDENT');

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" "PetAge" NOT NULL,
    "energy_level" "PetEnergyLevel" NOT NULL,
    "environment" "PetEnvironment" NOT NULL,
    "independency_level" "PetIndependencyLevel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetImages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "PetImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetRequirements" (
    "id" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "PetRequirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PetImages_url_key" ON "PetImages"("url");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetImages" ADD CONSTRAINT "PetImages_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetRequirements" ADD CONSTRAINT "PetRequirements_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
