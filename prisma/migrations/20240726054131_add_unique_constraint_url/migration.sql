/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,url]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `_RolePermissions` DROP FOREIGN KEY `_RolePermissions_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RolePermissions` DROP FOREIGN KEY `_RolePermissions_B_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `roleId`;

-- DropTable
DROP TABLE `Action`;

-- DropTable
DROP TABLE `Permission`;

-- DropTable
DROP TABLE `Role`;

-- DropTable
DROP TABLE `_RolePermissions`;

-- CreateIndex
CREATE UNIQUE INDEX `Url_userId_url_key` ON `Url`(`userId`, `url`);
