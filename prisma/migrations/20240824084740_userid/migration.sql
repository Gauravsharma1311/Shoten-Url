/*
  Warnings:

  - A unique constraint covering the columns `[userId,url]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Url_url_key` ON `Url`;

-- AlterTable
ALTER TABLE `Url` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Url_userId_url_key` ON `Url`(`userId`, `url`);

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
