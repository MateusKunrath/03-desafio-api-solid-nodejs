/*
  Warnings:

  - Added the required column `size` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('TOY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT');

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "size" "PetSize" NOT NULL;
