-- AlterTable
ALTER TABLE `Issue`
    ADD COLUMN `creatorId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Issue_creatorId_idx` ON `Issue`(`creatorId`);

-- AddForeignKey
ALTER TABLE `Issue`
    ADD CONSTRAINT `Issue_creatorId_fkey`
    FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
