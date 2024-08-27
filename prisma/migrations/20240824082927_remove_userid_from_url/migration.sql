/*
  Warnings:

  - You are about to drop the column `userId` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Url` DROP FOREIGN KEY `Url_userId_fkey`;

-- DropIndex
DROP INDEX `Url_userId_url_key` ON `Url`;

-- AlterTable
ALTER TABLE `Url` DROP COLUMN `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `Url_url_key` ON `Url`(`url`);
